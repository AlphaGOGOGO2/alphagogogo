
-- sync_service_name 함수의 search_path 보안 문제 해결
CREATE OR REPLACE FUNCTION public.sync_service_name()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.service_id IS NOT NULL THEN
    NEW.service_name = (SELECT name FROM public.ai_services WHERE id = NEW.service_id);
  END IF;
  RETURN NEW;
END;
$$;
