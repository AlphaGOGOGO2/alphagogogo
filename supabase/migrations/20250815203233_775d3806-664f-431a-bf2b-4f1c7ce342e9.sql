-- Secure visit_logs: restrict reads, keep inserts, and add dedup without immutable generated columns
ALTER TABLE public.visit_logs ENABLE ROW LEVEL SECURITY;

-- Drop public read policies
DROP POLICY IF EXISTS "Service role can manage all visits" ON public.visit_logs;
DROP POLICY IF EXISTS "Enable admin select" ON public.visit_logs;

-- Add plain visit_date column if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'visit_logs' AND column_name = 'visit_date'
  ) THEN
    ALTER TABLE public.visit_logs
    ADD COLUMN visit_date date;
  END IF;
END $$;

-- Create trigger function to populate visit_date from visited_at (UTC)
CREATE OR REPLACE FUNCTION public.set_visit_date()
RETURNS trigger AS $$
BEGIN
  IF NEW.visited_at IS NULL THEN
    NEW.visited_at = now();
  END IF;
  NEW.visit_date = (NEW.visited_at AT TIME ZONE 'UTC')::date;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Attach trigger (before insert or update)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_set_visit_date'
  ) THEN
    CREATE TRIGGER trg_set_visit_date
    BEFORE INSERT OR UPDATE ON public.visit_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.set_visit_date();
  END IF;
END $$;

-- Create unique index for (client_id, visit_date) to prevent duplicates per day
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