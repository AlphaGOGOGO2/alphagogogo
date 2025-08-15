-- Restrict public reads on invite tables, keep required inserts
ALTER TABLE public.invite_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invite_clicks ENABLE ROW LEVEL SECURITY;

-- Drop public SELECT policies
DROP POLICY IF EXISTS "Anyone can view invite links" ON public.invite_links;
DROP POLICY IF EXISTS "Anyone can view clicks" ON public.invite_clicks;

-- Optional: restrict direct updates on invite_links (handled by RPC)
DROP POLICY IF EXISTS "Anyone can update click count" ON public.invite_links;

-- Ensure public insert policies remain for functionality
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='invite_links' AND policyname='Anyone can create invite links'
  ) THEN
    CREATE POLICY "Anyone can create invite links"
    ON public.invite_links
    FOR INSERT
    WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='invite_clicks' AND policyname='Anyone can record clicks'
  ) THEN
    CREATE POLICY "Anyone can record clicks"
    ON public.invite_clicks
    FOR INSERT
    WITH CHECK (true);
  END IF;
END $$;