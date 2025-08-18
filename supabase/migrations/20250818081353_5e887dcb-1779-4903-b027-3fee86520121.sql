-- Secure ai_services table by restricting write operations to service_role only

-- 1) Remove the overly permissive policy that allows all operations
DROP POLICY IF EXISTS "Allow all operations on ai_services" ON public.ai_services;

-- 2) Keep public read access (combining existing policies for clarity)
DROP POLICY IF EXISTS "Anyone can view active services" ON public.ai_services;
DROP POLICY IF EXISTS "Anyone can view ai_services" ON public.ai_services;

CREATE POLICY "Public can read ai_services"
ON public.ai_services
FOR SELECT
USING (true);

-- 3) Restrict write operations to service_role only
CREATE POLICY "Only service_role can manage ai_services"
ON public.ai_services
FOR ALL
TO service_role
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 4) Enable RLS if not already enabled
ALTER TABLE public.ai_services ENABLE ROW LEVEL SECURITY;