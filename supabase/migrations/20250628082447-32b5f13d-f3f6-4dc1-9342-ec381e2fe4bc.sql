
-- AI 초대링크 품앗이를 위한 테이블들 생성

-- 초대링크 정보를 저장하는 메인 테이블
CREATE TABLE public.invite_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL CHECK (service_name IN ('lovable', 'manus')),
  invite_url TEXT NOT NULL UNIQUE,
  user_nickname TEXT NOT NULL,
  description TEXT,
  click_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 클릭 추적을 위한 테이블
CREATE TABLE public.invite_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_link_id UUID NOT NULL REFERENCES public.invite_links(id) ON DELETE CASCADE,
  ip_address TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS 정책 설정 (모든 사용자가 읽을 수 있고, 등록/클릭 가능)
ALTER TABLE public.invite_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invite_clicks ENABLE ROW LEVEL SECURITY;

-- invite_links 정책들
CREATE POLICY "Anyone can view invite links" 
  ON public.invite_links 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create invite links" 
  ON public.invite_links 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update click count" 
  ON public.invite_links 
  FOR UPDATE 
  USING (true);

-- invite_clicks 정책들  
CREATE POLICY "Anyone can view clicks" 
  ON public.invite_clicks 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can record clicks" 
  ON public.invite_clicks 
  FOR INSERT 
  WITH CHECK (true);

-- 실시간 업데이트를 위한 설정
ALTER TABLE public.invite_links REPLICA IDENTITY FULL;
ALTER TABLE public.invite_clicks REPLICA IDENTITY FULL;

-- 실시간 발행 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE public.invite_links;
ALTER PUBLICATION supabase_realtime ADD TABLE public.invite_clicks;

-- 클릭 수 업데이트를 위한 함수
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
END;
$$;
