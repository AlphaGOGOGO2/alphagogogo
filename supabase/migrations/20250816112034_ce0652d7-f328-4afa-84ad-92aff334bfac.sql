-- Restrict read access on resource_downloads to service_role only, keep public insert for logging

-- Ensure RLS is enabled (idempotent)
ALTER TABLE public.resource_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_downloads FORCE ROW LEVEL SECURITY;

-- Revoke direct grants to anon/authenticated/public (defense-in-depth)
DO $$ BEGIN
  BEGIN REVOKE ALL ON TABLE public.resource_downloads FROM anon; EXCEPTION WHEN others THEN NULL; END;
  BEGIN REVOKE ALL ON TABLE public.resource_downloads FROM authenticated; EXCEPTION WHEN others THEN NULL; END;
  BEGIN REVOKE ALL ON TABLE public.resource_downloads FROM public; EXCEPTION WHEN others THEN NULL; END;
END $$;

-- Drop existing SELECT policies to remove public readability
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'resource_downloads'
      AND cmd = 'SELECT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.resource_downloads;', r.policyname);
  END LOOP;
END $$;

-- Create strict SELECT policy for service_role only
CREATE POLICY resource_downloads_select_service_role_only
ON public.resource_downloads
FOR SELECT
USING (auth.role() = 'service_role');

-- Preserve existing INSERT capability for public logging (if no policy exists, create one idempotently)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'resource_downloads' 
      AND cmd = 'INSERT'
  ) THEN
    CREATE POLICY resource_downloads_public_insert
    ON public.resource_downloads
    FOR INSERT
    WITH CHECK (true);
  END IF;
END $$;

-- Ensure service_role can manage the table fully
DO $$ BEGIN
  BEGIN GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.resource_downloads TO service_role; EXCEPTION WHEN others THEN NULL; END;
END $$;