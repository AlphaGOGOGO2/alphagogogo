-- Lock down admin_users against public access and remove conflicting policies

-- 1) Enforce and force RLS (idempotent)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users FORCE ROW LEVEL SECURITY;

-- 2) Revoke any direct grants to anon/authenticated/public
DO $$ BEGIN
  BEGIN REVOKE ALL ON TABLE public.admin_users FROM anon; EXCEPTION WHEN others THEN NULL; END;
  BEGIN REVOKE ALL ON TABLE public.admin_users FROM authenticated; EXCEPTION WHEN others THEN NULL; END;
  BEGIN REVOKE ALL ON TABLE public.admin_users FROM public; EXCEPTION WHEN others THEN NULL; END;
END $$;

-- 3) Drop existing policies to avoid conflicts and recreate a strict one
DO $$
BEGIN
  PERFORM 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'admin_users';
  IF FOUND THEN
    EXECUTE (
      SELECT string_agg('DROP POLICY IF EXISTS ' || quote_ident(polname) || ' ON public.admin_users;', ' ')
      FROM pg_policies WHERE schemaname = 'public' AND tablename = 'admin_users'
    );
  END IF;
END $$;

-- Strict service_role-only policy (covers ALL commands)
CREATE POLICY admin_users_service_role_only
ON public.admin_users
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 4) Ensure service_role retains explicit table privileges (defense-in-depth)
DO $$ BEGIN
  BEGIN GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.admin_users TO service_role; EXCEPTION WHEN others THEN NULL; END;
END $$;

-- 5) Performance: add safe index used by edge function lookup
CREATE INDEX IF NOT EXISTS idx_admin_users_email_active ON public.admin_users(email, is_active);
