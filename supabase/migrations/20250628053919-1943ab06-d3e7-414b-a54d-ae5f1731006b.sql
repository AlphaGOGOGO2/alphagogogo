
-- resources 테이블에 INSERT를 허용하는 RLS 정책 추가
CREATE POLICY "Allow public insert on resources" 
ON public.resources 
FOR INSERT 
TO public 
WITH CHECK (true);

-- 기존 정책이 있다면 UPDATE와 DELETE도 허용
CREATE POLICY "Allow public update on resources" 
ON public.resources 
FOR UPDATE 
TO public 
USING (true);

CREATE POLICY "Allow public delete on resources" 
ON public.resources 
FOR DELETE 
TO public 
USING (true);

-- SELECT 정책도 확인하고 없다면 추가
CREATE POLICY "Allow public select on resources" 
ON public.resources 
FOR SELECT 
TO public 
USING (true);
