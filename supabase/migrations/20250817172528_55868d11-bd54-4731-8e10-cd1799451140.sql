-- Secure invite_clicks to service_role only and prevent public reads/writes
-- 1) Enforce RLS strictly
ALTER TABLE public.invite_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invite_clicks FORCE ROW LEVEL SECURITY;

-- 2) Replace public INSERT policy with service_role-only policy (idempotent)
DROP POLICY IF EXISTS "Anyone can record clicks" ON public.invite_clicks;
DROP POLICY IF EXISTS "invite_clicks_service_role_only" ON public.invite_clicks;
CREATE POLICY "invite_clicks_service_role_only"
ON public.invite_clicks
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 3) Lock down table privileges defensively (RLS remains authoritative)
DO $$
BEGIN
  BEGIN REVOKE ALL ON TABLE public.invite_clicks FROM anon; EXCEPTION WHEN others THEN NULL; END;
  BEGIN REVOKE ALL ON TABLE public.invite_clicks FROM authenticated; EXCEPTION WHEN others THEN NULL; END;
  BEGIN GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.invite_clicks TO service_role; EXCEPTION WHEN others THEN NULL; END;
END $$;