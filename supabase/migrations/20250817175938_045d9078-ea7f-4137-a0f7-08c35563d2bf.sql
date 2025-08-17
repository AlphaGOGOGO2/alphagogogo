-- Harden access to security_audit_logs and restrict monitoring function execution

-- 1) Ensure RLS is enabled and enforced on audit logs (idempotent)
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs FORCE ROW LEVEL SECURITY;

-- 2) Ensure only service_role has privileges on the audit table
DO $$ BEGIN
  REVOKE ALL ON TABLE public.security_audit_logs FROM PUBLIC;
  REVOKE ALL ON TABLE public.security_audit_logs FROM anon;
  REVOKE ALL ON TABLE public.security_audit_logs FROM authenticated;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.security_audit_logs TO service_role;
EXCEPTION WHEN others THEN NULL; END $$;

-- 3) Restrict the monitoring function so it cannot be called by anon/authenticated
DO $$ BEGIN
  REVOKE EXECUTE ON FUNCTION public.monitor_security_events() FROM PUBLIC;
  REVOKE EXECUTE ON FUNCTION public.monitor_security_events() FROM anon;
  REVOKE EXECUTE ON FUNCTION public.monitor_security_events() FROM authenticated;
EXCEPTION 
  WHEN undefined_function THEN NULL;
  WHEN others THEN NULL; 
END $$;

DO $$ BEGIN
  GRANT EXECUTE ON FUNCTION public.monitor_security_events() TO service_role;
EXCEPTION 
  WHEN undefined_function THEN NULL;
  WHEN others THEN NULL; 
END $$;