-- Remove public read access from invite_clicks to protect sensitive analytics data
DROP POLICY IF EXISTS "public_read_invite_clicks" ON public.invite_clicks;

-- Keep insert policy for recording clicks intact
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='invite_clicks' AND policyname='Anyone can record clicks'
  ) THEN
    CREATE POLICY "Anyone can record clicks"
    ON public.invite_clicks
    FOR INSERT
    WITH CHECK (true);
  END IF;
END $$;