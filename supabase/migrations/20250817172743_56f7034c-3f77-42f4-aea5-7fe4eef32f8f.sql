-- Harden admin_sessions to service_role-only access and enforce strict RLS
-- 1) Enforce and force RLS
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions FORCE ROW LEVEL SECURITY;

-- 2) Service role only policy (idempotent)
DROP POLICY IF EXISTS "admin_sessions_service_role_only" ON public.admin_sessions;
CREATE POLICY "admin_sessions_service_role_only"
ON public.admin_sessions
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 3) Lock down table privileges (defense in depth; RLS authoritative)
DO $$
BEGIN
  BEGIN REVOKE ALL ON TABLE public.admin_sessions FROM anon; EXCEPTION WHEN others THEN NULL; END;
  BEGIN REVOKE ALL ON TABLE public.admin_sessions FROM authenticated; EXCEPTION WHEN others THEN NULL; END;
  BEGIN GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.admin_sessions TO service_role; EXCEPTION WHEN others THEN NULL; END;
END $$;