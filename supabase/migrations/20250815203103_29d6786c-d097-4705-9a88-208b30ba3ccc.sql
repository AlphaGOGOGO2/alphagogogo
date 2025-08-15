-- Tighten RLS on visit_logs and add dedup safeguard without exposing data
-- 1) Ensure RLS is enabled (already enabled, but keep for idempotency)
ALTER TABLE public.visit_logs ENABLE ROW LEVEL SECURITY;

-- 2) Drop overly permissive policies exposing data publicly
DROP POLICY IF EXISTS "Service role can manage all visits" ON public.visit_logs;
DROP POLICY IF EXISTS "Enable admin select" ON public.visit_logs;

-- Keep INSERT open so anonymous clients can record visits (create if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'visit_logs' AND polname = 'Allow visit recording for all roles'
  ) THEN
    CREATE POLICY "Allow visit recording for all roles"
    ON public.visit_logs
    FOR INSERT
    WITH CHECK (true);
  END IF;
END $$;

-- 3) Add generated day column and unique index to prevent duplicate daily visits per client without needing SELECT
DO $$
BEGIN
  -- Add generated column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'visit_logs' AND column_name = 'visit_date'
  ) THEN
    ALTER TABLE public.visit_logs
    ADD COLUMN visit_date date GENERATED ALWAYS AS (date(visited_at)) STORED;
  END IF;
END $$;

-- Create unique index for (client_id, visit_date) where client_id is not null
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'i' AND c.relname = 'uniq_visit_client_date' AND n.nspname = 'public'
  ) THEN
    CREATE UNIQUE INDEX uniq_visit_client_date
    ON public.visit_logs (client_id, visit_date)
    WHERE client_id IS NOT NULL;
  END IF;
END $$;