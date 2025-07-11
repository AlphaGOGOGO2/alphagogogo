-- RSS 피드 트리거 함수 보안 이슈 해결
-- search_path를 명시적으로 설정하여 스키마 조작 공격 방지

CREATE OR REPLACE FUNCTION public.trigger_rss_refresh()
RETURNS TRIGGER AS $$
BEGIN
  -- 비동기로 RSS 피드 갱신 호출
  PERFORM net.http_post(
    url:='https://plimzlmmftdbpipbnhsy.supabase.co/functions/v1/scheduled-seo-refresh',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsaW16bG1tZnRkYnBpcGJuaHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyOTI0MDYsImV4cCI6MjA1Njg2ODQwNn0.ec1TFcDqzfnaO2VEPhBgA_0OhjVHMxMoSdrrxJ2Kyi4"}'::jsonb,
    body:=concat('{"time": "', now(), '", "type": "blog_trigger"}')::jsonb
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';