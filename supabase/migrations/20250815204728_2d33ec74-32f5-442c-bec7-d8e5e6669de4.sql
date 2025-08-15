-- Enhance admin_sessions security - ensure strict service role only access
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might be too permissive
DROP POLICY IF EXISTS "Service role access only" ON public.admin_sessions;

-- Create a very strict policy that only allows service_role access
CREATE POLICY "Strict service role only access"
ON public.admin_sessions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Explicitly block all access for authenticated and anonymous users
CREATE POLICY "Block all user access to admin sessions"
ON public.admin_sessions
FOR ALL
TO authenticated, anon
USING (false)
WITH CHECK (false);

-- Add additional security: ensure admin_users table is also secure
-- Check if admin_users already has restrictive policies
DO $$
BEGIN
  -- Drop any overly permissive policies on admin_users if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='admin_users' 
    AND policyname = 'Service role access only'
  ) THEN
    DROP POLICY "Service role access only" ON public.admin_users;
  END IF;
  
  -- Create strict policy for admin_users too
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='admin_users' 
    AND policyname = 'Strict service role only access'
  ) THEN
    CREATE POLICY "Strict service role only access"
    ON public.admin_users
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='admin_users' 
    AND policyname = 'Block all user access to admin users'
  ) THEN
    CREATE POLICY "Block all user access to admin users"
    ON public.admin_users
    FOR ALL
    TO authenticated, anon
    USING (false)
    WITH CHECK (false);
  END IF;
END $$;