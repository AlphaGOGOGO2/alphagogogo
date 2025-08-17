-- Harden admin_login_attempts to prevent email harvesting and ensure service_role-only access
-- 1) Enforce RLS strictly
ALTER TABLE public.admin_login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_login_attempts FORCE ROW LEVEL SECURITY;

-- 2) Service role only policy (idempotent)
DROP POLICY IF EXISTS "admin_login_attempts_service_role_only" ON public.admin_login_attempts;
CREATE POLICY "admin_login_attempts_service_role_only"
ON public.admin_login_attempts
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 3) Ensure emails are never stored (nullify on insert/update)
DROP TRIGGER IF EXISTS tr_nullify_admin_attempt_email ON public.admin_login_attempts;
CREATE TRIGGER tr_nullify_admin_attempt_email
BEFORE INSERT OR UPDATE ON public.admin_login_attempts
FOR EACH ROW
EXECUTE FUNCTION public.nullify_admin_attempt_email();

-- 4) Automatic retention cleanup (7 days) after each insert
DROP TRIGGER IF EXISTS tr_cleanup_admin_login_attempts ON public.admin_login_attempts;
CREATE TRIGGER tr_cleanup_admin_login_attempts
AFTER INSERT ON public.admin_login_attempts
FOR EACH ROW
EXECUTE FUNCTION public.cleanup_old_admin_login_attempts();

-- 5) Data cleanup for any previously stored emails
UPDATE public.admin_login_attempts SET email = NULL WHERE email IS NOT NULL;

-- 6) Lock down table privileges defensively (RLS is still authoritative)
DO $$
BEGIN
  BEGIN REVOKE ALL ON TABLE public.admin_login_attempts FROM anon; EXCEPTION WHEN others THEN NULL; END;
  BEGIN REVOKE ALL ON TABLE public.admin_login_attempts FROM authenticated; EXCEPTION WHEN others THEN NULL; END;
  BEGIN GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.admin_login_attempts TO service_role; EXCEPTION WHEN others THEN NULL; END;
END $$;