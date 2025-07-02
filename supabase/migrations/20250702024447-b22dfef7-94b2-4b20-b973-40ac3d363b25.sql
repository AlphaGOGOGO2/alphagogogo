-- 사이트맵 생성을 위한 Edge Function 생성
-- RSS 피드 개선을 위한 추가 쿼리 최적화

-- blog_posts 테이블에 인덱스 추가 (사이트맵과 RSS 성능 개선)
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);

-- resources 테이블에 인덱스 추가 (사이트맵 성능 개선)
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_is_featured ON public.resources(is_featured) WHERE is_featured = true;