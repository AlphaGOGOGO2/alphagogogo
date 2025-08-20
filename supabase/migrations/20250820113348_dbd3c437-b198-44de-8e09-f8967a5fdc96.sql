-- resource_downloads 테이블의 RLS 정책 수정
-- 기존 정책 삭제 후 새로 생성

DROP POLICY IF EXISTS "Allow public insert for downloads" ON public.resource_downloads;

-- 공개 INSERT 정책 재생성 (더 명확한 조건)
CREATE POLICY "Public can insert download records"
ON public.resource_downloads
FOR INSERT
TO public
WITH CHECK (true);

-- 기존 SELECT 정책도 확인하고 수정
DROP POLICY IF EXISTS "resource_downloads_select_service_role_only" ON public.resource_downloads;

CREATE POLICY "Service role can read download records"
ON public.resource_downloads  
FOR SELECT
TO service_role
USING (true);