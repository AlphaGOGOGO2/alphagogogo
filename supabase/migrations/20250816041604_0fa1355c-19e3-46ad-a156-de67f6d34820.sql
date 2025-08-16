-- Fix migration: drop any conflicting policies and lock down admin_users

-- Enforce and force RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users FORCE ROW LEVEL SECURITY;

-- Revoke grants to non-service roles
DO $$ BEGIN
  BEGIN REVOKE ALL ON TABLE public.admin_users FROM anon; EXCEPTION WHEN others THEN NULL; END;
  BEGIN REVOKE ALL ON TABLE public.admin_users FROM authenticated; EXCEPTION WHEN others THEN NULL; END;
  BEGIN REVOKE ALL ON TABLE public.admin_users FROM public; EXCEPTION WHEN others THEN NULL; END;
END $$;

-- Drop all existing policies on admin_users
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'admin_users' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.admin_users;', r.policyname);
  END LOOP;
END $$;

-- Create strict service_role-only policy
CREATE POLICY admin_users_service_role_only
ON public.admin_users
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Ensure service_role retains privileges
DO $$ BEGIN
  BEGIN GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.admin_users TO service_role; EXCEPTION WHEN others THEN NULL; END;
END $$;

-- Performance index
CREATE INDEX IF NOT EXISTS idx_admin_users_email_active ON public.admin_users(email, is_active);