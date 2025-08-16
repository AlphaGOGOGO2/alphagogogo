-- Harden admin-sensitive tables against public access
-- 1) Enforce and force RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users FORCE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.admin_login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_login_attempts FORCE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE public.visit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visit_logs FORCE ROW LEVEL SECURITY;

-- 2) Revoke any direct grants from anon/authenticated roles (defense-in-depth)
DO $$ BEGIN
  BEGIN REVOKE ALL ON TABLE public.admin_users FROM anon; EXCEPTION WHEN others THEN NULL; END;
  BEGIN REVOKE ALL ON TABLE public.admin_users FROM authenticated; EXCEPTION WHEN others THEN NULL; END;
  BEGIN REVOKE ALL ON TABLE public.admin_sessions FROM anon; EXCEPTION WHEN others THEN NULL; END;
  BEGIN REVOKE ALL ON TABLE public.admin_sessions FROM authenticated; EXCEPTION WHEN others THEN NULL; END;
  BEGIN REVOKE ALL ON TABLE public.admin_login_attempts FROM anon; EXCEPTION WHEN others THEN NULL; END;
  BEGIN REVOKE ALL ON TABLE public.admin_login_attempts FROM authenticated; EXCEPTION WHEN others THEN NULL; END;
  BEGIN REVOKE ALL ON TABLE public.security_audit_logs FROM anon; EXCEPTION WHEN others THEN NULL; END;
  BEGIN REVOKE ALL ON TABLE public.security_audit_logs FROM authenticated; EXCEPTION WHEN others THEN NULL; END;
  BEGIN REVOKE ALL ON TABLE public.visit_logs FROM anon; EXCEPTION WHEN others THEN NULL; END;
  BEGIN REVOKE ALL ON TABLE public.visit_logs FROM authenticated; EXCEPTION WHEN others THEN NULL; END;
END $$;

-- 3) Ensure service_role retains explicit access (optional, usually preconfigured by Supabase)
DO $$ BEGIN
  BEGIN GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.admin_users TO service_role; EXCEPTION WHEN others THEN NULL; END;
  BEGIN GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.admin_sessions TO service_role; EXCEPTION WHEN others THEN NULL; END;
  BEGIN GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.admin_login_attempts TO service_role; EXCEPTION WHEN others THEN NULL; END;
  BEGIN GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.security_audit_logs TO service_role; EXCEPTION WHEN others THEN NULL; END;
  BEGIN GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.visit_logs TO service_role; EXCEPTION WHEN others THEN NULL; END;
END $$;