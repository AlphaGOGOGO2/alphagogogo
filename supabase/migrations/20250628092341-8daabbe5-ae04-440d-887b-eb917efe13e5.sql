
-- 클릭수 증가 함수를 수정하여 클릭수가 100에 도달하면 자동 삭제
CREATE OR REPLACE FUNCTION public.increment_invite_click_count(link_id UUID, client_ip TEXT DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- 같은 IP에서 24시간 내 중복 클릭 방지
  IF client_ip IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.invite_clicks 
      WHERE invite_link_id = link_id 
      AND ip_address = client_ip 
      AND clicked_at > now() - interval '24 hours'
    ) THEN
      RETURN; -- 중복 클릭이므로 카운트하지 않음
    END IF;
  END IF;

  -- 클릭 기록 추가
  INSERT INTO public.invite_clicks (invite_link_id, ip_address)
  VALUES (link_id, client_ip);
  
  -- 클릭 수 증가
  UPDATE public.invite_links 
  SET click_count = click_count + 1, updated_at = now()
  WHERE id = link_id;
  
  -- 클릭수가 100에 도달하면 해당 링크와 모든 관련 클릭 기록 삭제
  IF (SELECT click_count FROM public.invite_links WHERE id = link_id) >= 100 THEN
    -- 관련 클릭 기록 먼저 삭제 (외래키 제약 때문)
    DELETE FROM public.invite_clicks WHERE invite_link_id = link_id;
    -- 초대링크 삭제
    DELETE FROM public.invite_links WHERE id = link_id;
  END IF;
END;
$$;
