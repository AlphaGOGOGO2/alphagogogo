-- Strengthen RLS for invite_links and add validation

-- 1) Helper function to validate invite link against ai_services.url_pattern
CREATE OR REPLACE FUNCTION public.is_valid_invite_link(p_service_id uuid, p_invite_url text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.ai_services s
    WHERE s.id = p_service_id
      AND p_invite_url LIKE s.url_pattern || '%'
  );
$$;

COMMENT ON FUNCTION public.is_valid_invite_link IS 'Checks that invite_url starts with the url_pattern of the given service_id.';

-- 2) Normalization trigger to trim inputs and maintain timestamps
CREATE OR REPLACE FUNCTION public.normalize_invite_link_row()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.user_nickname := trim(COALESCE(NEW.user_nickname, ''));
  NEW.description := CASE WHEN NEW.description IS NULL THEN NULL ELSE trim(NEW.description) END;
  NEW.invite_url := trim(COALESCE(NEW.invite_url, ''));
  NEW.service_name := lower(trim(COALESCE(NEW.service_name, '')));
  NEW.updated_at := now();
  IF NEW.created_at IS NULL THEN
    NEW.created_at := now();
  END IF;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_normalize_invite_link_row'
  ) THEN
    DROP TRIGGER trg_normalize_invite_link_row ON public.invite_links;
  END IF;
END $$;

CREATE TRIGGER trg_normalize_invite_link_row
BEFORE INSERT OR UPDATE ON public.invite_links
FOR EACH ROW EXECUTE FUNCTION public.normalize_invite_link_row();

-- 3) Prevent duplicate links
CREATE UNIQUE INDEX IF NOT EXISTS idx_invite_links_invite_url_unique
ON public.invite_links (invite_url);

-- 4) RLS: tighten insert policy
ALTER TABLE public.invite_links ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='invite_links' AND policyname='Anyone can create invite links'
  ) THEN
    DROP POLICY "Anyone can create invite links" ON public.invite_links;
  END IF;
END $$;

CREATE POLICY "Public can insert valid invite links"
ON public.invite_links
FOR INSERT
WITH CHECK (
  public.is_valid_invite_link(service_id, invite_url)
  AND service_id IS NOT NULL
  AND invite_url <> ''
  AND char_length(user_nickname) BETWEEN 1 AND 50
);

-- Keep reads restricted to Edge Function (service role), no public SELECT policy is created.
