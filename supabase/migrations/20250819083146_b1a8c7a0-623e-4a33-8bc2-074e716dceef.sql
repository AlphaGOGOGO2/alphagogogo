-- Harden access to security-related tables and functions

-- 1) Ensure RLS is enabled explicitly (defense in depth)
ALTER TABLE public.security_threats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- 2) Revoke table privileges from anon/authenticated and grant only to service_role
REVOKE ALL ON TABLE public.security_threats FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.security_threats TO service_role;

REVOKE ALL ON TABLE public.security_audit_logs FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.security_audit_logs TO service_role;

-- 3) Restrict execution of sensitive SECURITY DEFINER functions to service_role only
REVOKE EXECUTE ON FUNCTION public.monitor_security_events() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.monitor_security_events() TO service_role;

REVOKE EXECUTE ON FUNCTION public.log_security_event(text, text, text, text, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.log_security_event(text, text, text, text, jsonb) TO service_role;

REVOKE EXECUTE ON FUNCTION public.detect_security_threat(text, text, text, text, jsonb, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.detect_security_threat(text, text, text, text, jsonb, text) TO service_role;
