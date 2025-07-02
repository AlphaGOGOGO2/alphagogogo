-- pg_cron과 pg_net 확장 활성화 (정기적 SEO 갱신용)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 매일 새벽 2시에 SEO 피드 갱신하는 크론 작업 생성
SELECT cron.schedule(
  'daily-seo-refresh',
  '0 2 * * *', -- 매일 새벽 2시
  $$
  SELECT
    net.http_post(
        url:='https://plimzlmmftdbpipbnhsy.supabase.co/functions/v1/scheduled-seo-refresh',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsaW16bG1tZnRkYnBpcGJuaHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyOTI0MDYsImV4cCI6MjA1Njg2ODQwNn0.ec1TFcDqzfnaO2VEPhBgA_0OhjVHMxMoSdrrxJ2Kyi4"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- 매주 일요일 새벽 3시에 추가 SEO 갱신 (주간 정리)
SELECT cron.schedule(
  'weekly-seo-deep-refresh',
  '0 3 * * 0', -- 매주 일요일 새벽 3시
  $$
  SELECT
    net.http_post(
        url:='https://plimzlmmftdbpipbnhsy.supabase.co/functions/v1/scheduled-seo-refresh',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsaW16bG1tZnRkYnBpcGJuaHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyOTI0MDYsImV4cCI6MjA1Njg2ODQwNn0.ec1TFcDqzfnaO2VEPhBgA_0OhjVHMxMoSdrrxJ2Kyi4"}'::jsonb,
        body:=concat('{"time": "', now(), '", "type": "weekly"}')::jsonb
    ) as request_id;
  $$
);