-- Harden admin_login_attempts access: service role only, ensure RLS, remove any stray public policies
ALTER TABLE public.admin_login_attempts ENABLE ROW LEVEL SECURITY;

-- Drop possibly existing policies except the one we will recreate
DROP POLICY IF EXISTS "public_read_admin_login_attempts" ON public.admin_login_attempts;
DROP POLICY IF EXISTS "Allow public read access" ON public.admin_login_attempts;
DROP POLICY IF EXISTS "admin_login_attempts_select_public" ON public.admin_login_attempts;
DROP POLICY IF EXISTS "admin_login_attempts_service_role_only" ON public.admin_login_attempts;

-- Create strict service role only policy for all commands
CREATE POLICY "admin_login_attempts_service_role_only" ON public.admin_login_attempts
FOR ALL USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Clarify intent
COMMENT ON TABLE public.admin_login_attempts IS 'Tracks admin login attempts for server-side rate limiting. Access restricted to service_role via RLS. No public read.';