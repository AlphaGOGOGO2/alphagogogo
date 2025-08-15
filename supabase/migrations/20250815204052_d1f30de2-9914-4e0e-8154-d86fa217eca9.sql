-- Secure resource_downloads table - remove public read access
ALTER TABLE public.resource_downloads ENABLE ROW LEVEL SECURITY;

-- Drop public read policy if it exists
DROP POLICY IF EXISTS "Allow public read access" ON public.resource_downloads;

-- Ensure public insert is still allowed for download tracking
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='resource_downloads' AND policyname='Allow public insert for downloads'
  ) THEN
    CREATE POLICY "Allow public insert for downloads"
    ON public.resource_downloads
    FOR INSERT
    WITH CHECK (true);
  END IF;
END $$;