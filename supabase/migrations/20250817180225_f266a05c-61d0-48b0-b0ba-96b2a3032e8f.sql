-- Harden admin_sessions exposure and restrict session-related RPC

-- 1) Enforce strict RLS on admin_sessions (idempotent)
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions FORCE ROW LEVEL SECURITY;

-- 2) Ensure service_role-only policy exists (recreate safely)
DROP POLICY IF EXISTS "admin_sessions_service_role_only" ON public.admin_sessions;
CREATE POLICY "admin_sessions_service_role_only"
ON public.admin_sessions
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 3) Revoke table privileges from non-service roles and grant to service_role
DO $$ BEGIN
  REVOKE ALL ON TABLE public.admin_sessions FROM PUBLIC;
  REVOKE ALL ON TABLE public.admin_sessions FROM anon;
  REVOKE ALL ON TABLE public.admin_sessions FROM authenticated;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.admin_sessions TO service_role;
EXCEPTION WHEN others THEN NULL; END $$;

-- 4) Restrict execution of session maintenance functions to service_role only
DO $$ BEGIN
  REVOKE EXECUTE ON FUNCTION public.cleanup_expired_admin_sessions() FROM PUBLIC;
  REVOKE EXECUTE ON FUNCTION public.cleanup_expired_admin_sessions() FROM anon;
  REVOKE EXECUTE ON FUNCTION public.cleanup_expired_admin_sessions() FROM authenticated;
EXCEPTION WHEN undefined_function THEN NULL; WHEN others THEN NULL; END $$;

DO $$ BEGIN
  GRANT EXECUTE ON FUNCTION public.cleanup_expired_admin_sessions() TO service_role;
EXCEPTION WHEN undefined_function THEN NULL; WHEN others THEN NULL; END $$;

DO $$ BEGIN
  REVOKE EXECUTE ON FUNCTION public.update_session_last_used() FROM PUBLIC;
  REVOKE EXECUTE ON FUNCTION public.update_session_last_used() FROM anon;
  REVOKE EXECUTE ON FUNCTION public.update_session_last_used() FROM authenticated;
EXCEPTION WHEN undefined_function THEN NULL; WHEN others THEN NULL; END $$;

DO $$ BEGIN
  GRANT EXECUTE ON FUNCTION public.update_session_last_used() TO service_role;
EXCEPTION WHEN undefined_function THEN NULL; WHEN others THEN NULL; END $$;