-- Create admin_login_attempts table with strict RLS and retention
-- Purpose: Enable server-side rate limiting for admin login attempts used by the secure-admin-auth edge function

-- 1) Table creation (idempotent)
CREATE TABLE IF NOT EXISTS public.admin_login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  user_agent text,
  email text,
  attempted_at timestamptz NOT NULL DEFAULT now(),
  success boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- 2) Enable Row Level Security and restrict to service_role only
ALTER TABLE public.admin_login_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_login_attempts_service_role_only" ON public.admin_login_attempts;
CREATE POLICY "admin_login_attempts_service_role_only" ON public.admin_login_attempts
FOR ALL USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 3) Performance index for rate-limit window lookups
CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_ip_time
  ON public.admin_login_attempts (ip_address, attempted_at DESC);

-- 4) Automatic retention: clean records older than 7 days on each insert to avoid bloat
CREATE OR REPLACE FUNCTION public.cleanup_old_admin_login_attempts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.admin_login_attempts
  WHERE attempted_at < now() - interval '7 days';
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS tr_cleanup_admin_login_attempts ON public.admin_login_attempts;
CREATE TRIGGER tr_cleanup_admin_login_attempts
AFTER INSERT ON public.admin_login_attempts
FOR EACH STATEMENT
EXECUTE FUNCTION public.cleanup_old_admin_login_attempts();

-- 5) Document intent for auditors
COMMENT ON TABLE public.admin_login_attempts IS 'Tracks admin login attempts for server-side rate limiting. Access limited to service_role via RLS.';
COMMENT ON COLUMN public.admin_login_attempts.ip_address IS 'Client IP address (text stored)';
COMMENT ON COLUMN public.admin_login_attempts.attempted_at IS 'Attempt timestamp';
COMMENT ON COLUMN public.admin_login_attempts.success IS 'Whether the attempt was successful';