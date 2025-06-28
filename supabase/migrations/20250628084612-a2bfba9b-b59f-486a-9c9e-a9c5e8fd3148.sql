
-- AI 서비스 정보를 관리하는 테이블 생성
CREATE TABLE public.ai_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE, -- 서비스 코드명 (lovable, manus 등)
  display_name TEXT NOT NULL, -- 표시될 서비스명 (러버블, 마누스 등)
  url_pattern TEXT NOT NULL, -- 초대링크 패턴
  description TEXT NOT NULL, -- 서비스 설명
  benefits JSONB NOT NULL DEFAULT '[]'::jsonb, -- 혜택 목록
  is_active BOOLEAN NOT NULL DEFAULT true, -- 활성화 여부
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 기존 체크 제약 조건 제거 (동적 서비스 관리를 위해)
ALTER TABLE public.invite_links DROP CONSTRAINT IF EXISTS invite_links_service_name_check;

-- invite_links 테이블에 외래키 추가를 위한 컬럼 타입 변경 준비
ALTER TABLE public.invite_links ADD COLUMN service_id UUID;

-- 기존 데이터를 위한 초기 서비스 데이터 삽입
INSERT INTO public.ai_services (name, display_name, url_pattern, description, benefits) VALUES
('lovable', '러버블', 'https://lovable.dev/invite/', '웹 애플리케이션 개발 플랫폼', 
 '["초대받은 사람: 추가 10크레딧 획득", "초대한 사람: 상대방이 첫 웹사이트 발행 시 10크레딧 획득"]'::jsonb),
('manus', '마누스', 'https://manus.im/invitation/', 'AI 글쓰기 도구', 
 '["친구들과 초대 링크를 공유하고, 각자 500 크레딧을 받으세요"]'::jsonb);

-- 기존 invite_links 데이터의 service_id 업데이트
UPDATE public.invite_links 
SET service_id = (SELECT id FROM public.ai_services WHERE name = invite_links.service_name);

-- 외래키 제약 조건 추가
ALTER TABLE public.invite_links 
ADD CONSTRAINT fk_invite_links_service 
FOREIGN KEY (service_id) REFERENCES public.ai_services(id);

-- service_name 컬럼은 호환성을 위해 유지하되, 트리거로 동기화
CREATE OR REPLACE FUNCTION sync_service_name()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.service_id IS NOT NULL THEN
    NEW.service_name = (SELECT name FROM public.ai_services WHERE id = NEW.service_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sync_service_name
  BEFORE INSERT OR UPDATE ON public.invite_links
  FOR EACH ROW EXECUTE FUNCTION sync_service_name();

-- ai_services 테이블에 RLS 정책 설정
ALTER TABLE public.ai_services ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 활성화된 서비스를 조회할 수 있도록
CREATE POLICY "Anyone can view active services" 
  ON public.ai_services 
  FOR SELECT 
  USING (is_active = true);

-- 실시간 업데이트를 위한 설정
ALTER TABLE public.ai_services REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_services;
