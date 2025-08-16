-- Secure sensitive tables with strict service_role-only access and ensure RLS is enabled

-- 1) admin_users: restrict to service role only
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_users_service_role_only" ON public.admin_users;
DROP POLICY IF EXISTS "Block all user access to admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Strict service role only access" ON public.admin_users;
CREATE POLICY "admin_users_service_role_only" ON public.admin_users
FOR ALL USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 2) admin_sessions: restrict to service role only
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_sessions_service_role_only" ON public.admin_sessions;
DROP POLICY IF EXISTS "Block all user access to admin sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "Strict service role only access" ON public.admin_sessions;
CREATE POLICY "admin_sessions_service_role_only" ON public.admin_sessions
FOR ALL USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 3) security_audit_logs: ensure service role only and drop any public policies
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_security_audit_logs" ON public.security_audit_logs;
DROP POLICY IF EXISTS "service_role_only_audit_logs" ON public.security_audit_logs;
CREATE POLICY "service_role_only_audit_logs" ON public.security_audit_logs
FOR ALL USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 4) visit_logs: allow only service role; remove public access
ALTER TABLE public.visit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_visit_logs" ON public.visit_logs;
DROP POLICY IF EXISTS "No direct user access to visit logs" ON public.visit_logs;
DROP POLICY IF EXISTS "visit_logs_service_role_only" ON public.visit_logs;
CREATE POLICY "visit_logs_service_role_only" ON public.visit_logs
FOR ALL USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');