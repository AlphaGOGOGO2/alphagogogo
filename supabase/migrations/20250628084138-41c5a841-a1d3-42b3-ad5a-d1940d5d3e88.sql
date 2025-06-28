
-- 기존 체크 제약 조건 제거
ALTER TABLE public.invite_links DROP CONSTRAINT IF EXISTS invite_links_service_name_check;

-- 새로운 체크 제약 조건 추가 (lovable과 manus 허용)
ALTER TABLE public.invite_links ADD CONSTRAINT invite_links_service_name_check 
CHECK (service_name IN ('lovable', 'manus'));
