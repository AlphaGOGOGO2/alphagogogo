-- pg_net 확장을 안전한 스키마로 이동
-- 먼저 extensions 전용 스키마 생성
CREATE SCHEMA IF NOT EXISTS extensions;

-- pg_net 확장을 public 스키마에서 extensions 스키마로 이동
DROP EXTENSION IF EXISTS pg_net CASCADE;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- pg_cron은 기본 스키마에 유지 (시스템 요구사항)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 크론 작업 다시 생성 (extensions 스키마의 net 함수 사용)
SELECT cron.schedule(
  'daily-seo-refresh',
  '0 2 * * *', -- 매일 새벽 2시
  $$
  SELECT
    extensions.http_post(
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
    extensions.http_post(
        url:='https://plimzlmmftdbpipbnhsy.supabase.co/functions/v1/scheduled-seo-refresh',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsaW16bG1tZnRkYnBpcGJuaHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyOTI0MDYsImV4cCI6MjA1Njg2ODQwNn0.ec1TFcDqzfnaO2VEPhBgA_0OhjVHMxMoSdrrxJ2Kyi4"}'::jsonb,
        body:=concat('{"time": "', now(), '", "type": "weekly"}')::jsonb
    ) as request_id;
  $$
);