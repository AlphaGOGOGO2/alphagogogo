-- 자료실 관리를 위한 RLS 정책 추가

-- service_role이 resources 테이블을 관리할 수 있도록 정책 추가
CREATE POLICY "service_role_manage_resources" 
ON public.resources 
FOR ALL 
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);

-- resource_categories 테이블도 service_role이 관리할 수 있도록 정책 추가
CREATE POLICY "service_role_manage_resource_categories" 
ON public.resource_categories 
FOR ALL 
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);