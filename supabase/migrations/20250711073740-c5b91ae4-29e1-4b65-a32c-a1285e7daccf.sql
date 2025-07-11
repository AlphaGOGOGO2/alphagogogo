-- RSS 피드 자동 업데이트 시스템 구축
-- 기존 cron 작업들 정리 후 새로 설정

-- 기존 cron 작업 제거
SELECT cron.unschedule('daily-seo-refresh');
SELECT cron.unschedule('weekly-seo-deep-refresh');

-- 매 10분마다 RSS 피드와 사이트맵 갱신하는 cron 작업 생성
SELECT cron.schedule(
  'rss-feed-auto-refresh',
  '*/10 * * * *', -- 매 10분마다
  $$
  SELECT
    net.http_post(
        url:='https://plimzlmmftdbpipbnhsy.supabase.co/functions/v1/scheduled-seo-refresh',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsaW16bG1tZnRkYnBpcGJuaHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyOTI0MDYsImV4cCI6MjA1Njg2ODQwNn0.ec1TFcDqzfnaO2VEPhBgA_0OhjVHMxMoSdrrxJ2Kyi4"}'::jsonb,
        body:=concat('{"time": "', now(), '", "type": "auto"}')::jsonb
    ) as request_id;
  $$
);

-- 블로그 포스트 변경 시 자동으로 RSS 피드 갱신하는 함수 생성
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 블로그 포스트 INSERT, UPDATE, DELETE 시 RSS 피드 갱신 트리거 생성
DROP TRIGGER IF EXISTS blog_posts_rss_refresh_trigger ON public.blog_posts;
CREATE TRIGGER blog_posts_rss_refresh_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_rss_refresh();