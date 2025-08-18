import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SITE_DOMAIN = 'https://alphagogogo.com';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const robotsContent = `User-agent: *
Allow: /

# 이미지 크롤링 허용
Allow: /images/
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.png$
Allow: /*.gif$
Allow: /*.webp$
Allow: /*.svg$

# 검색엔진이 크롤링하지 않았으면 하는 영역 (더 세밀한 제어)
Disallow: /blog/write
Disallow: /blog/edit/
Disallow: /admin/
Disallow: /private/
Disallow: /_next/
Disallow: /api/auth/
Disallow: /node_modules/
Disallow: /.git/
Disallow: /src/

# 블로그 포스트는 적극적으로 크롤링 허용
Allow: /blog/
Allow: /blog/*

# 검색엔진이 유용하지 않은 파라미터 페이지를 크롤링하지 않도록 설정
Disallow: /*?*utm_source=
Disallow: /*?*utm_medium=
Disallow: /*?*utm_campaign=
Disallow: /*?*utm_term=
Disallow: /*?*utm_content=
Disallow: /*?*ref=
Disallow: /*?*fbclid=
Disallow: /*?*gclid=
Disallow: /*?*print=
Disallow: /*?*share=

# 크롤링 속도 제한 완화 (더 빠른 크롤링 허용)
Crawl-delay: 0.2

# 사이트맵 위치 명시 (올바른 경로로 수정)
Sitemap: ${SITE_DOMAIN}/sitemap.xml
Sitemap: ${SITE_DOMAIN}/rss.xml

# 호스트 지정
Host: ${SITE_DOMAIN}

# 구글봇 최적화 설정
User-agent: Googlebot
Allow: /
Crawl-delay: 0.2

# 네이버봇 설정
User-agent: Yeti
Allow: /
Crawl-delay: 0.5

# 빙봇 설정
User-agent: bingbot
Allow: /
Crawl-delay: 0.3`;

    console.log('robots.txt 요청 처리됨');

    return new Response(robotsContent, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'inline; filename="robots.txt"',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'public, max-age=600, must-revalidate',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('robots.txt 생성 에러:', error);
    return new Response(
      'User-agent: *\nAllow: /',
      {
        status: 500,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          ...corsHeaders,
        },
      }
    );
  }
});