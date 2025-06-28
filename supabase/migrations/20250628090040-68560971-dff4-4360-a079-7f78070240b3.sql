
-- ai_services 테이블에 대한 RLS 정책 추가
-- 모든 사용자가 서비스를 조회할 수 있도록 허용 (공개 데이터)
CREATE POLICY "Anyone can view ai_services" 
ON public.ai_services 
FOR SELECT 
USING (true);

-- 관리자만 서비스를 추가/수정/삭제할 수 있도록 허용
-- 현재 인증 시스템이 없으므로 임시로 모든 작업을 허용
CREATE POLICY "Allow all operations on ai_services" 
ON public.ai_services 
FOR ALL 
USING (true) 
WITH CHECK (true);
