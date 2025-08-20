-- Ensure visit_logs has needed columns and uniqueness for per-day unique client visits
-- 1) Add visited_at column if missing
ALTER TABLE public.visit_logs
  ADD COLUMN IF NOT EXISTS visited_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- 2) Add visit_date as generated column (based on visited_at) if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'visit_logs' AND column_name = 'visit_date'
  ) THEN
    ALTER TABLE public.visit_logs
      ADD COLUMN visit_date DATE GENERATED ALWAYS AS ((visited_at AT TIME ZONE 'UTC')::date) STORED;
  END IF;
END$$;

-- 3) Deduplicate rows by (client_id, visit_date) keeping one row arbitrarily
--    Use ctid to safely delete duplicates without relying on a primary key name
DELETE FROM public.visit_logs t1
USING public.visit_logs t2
WHERE t1.ctid < t2.ctid
  AND t1.client_id = t2.client_id
  AND (
    COALESCE(t1.visit_date, (t1.visited_at AT TIME ZONE 'UTC')::date)
  ) = (
    COALESCE(t2.visit_date, (t2.visited_at AT TIME ZONE 'UTC')::date)
  );

-- 4) Add the exact unique constraint name expected by application logic
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'uniq_visit_client_date'
      AND conrelid = 'public.visit_logs'::regclass
  ) THEN
    ALTER TABLE public.visit_logs
      ADD CONSTRAINT uniq_visit_client_date UNIQUE (client_id, visit_date);
  END IF;
END$$;