import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SITE_DOMAIN = 'https://alphagogogo.com';

serve(async (req) => {
  try {
    console.log('robots.txt request received:', req.method, req.url);
    
    const robotsContent = `User-agent: *
Allow: /

# Image crawling allowed
Allow: /images/
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.png$
Allow: /*.gif$
Allow: /*.webp$
Allow: /*.svg$

# Areas not to be crawled by search engines
Disallow: /blog/write
Disallow: /blog/edit/
Disallow: /admin/
Disallow: /private/
Disallow: /_next/
Disallow: /api/auth/
Disallow: /node_modules/
Disallow: /.git/
Disallow: /src/

# Blog posts actively allowed for crawling
Allow: /blog/
Allow: /blog/*

# Prevent crawling of parameter pages that are not useful to search engines
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

# Crawling speed limit relaxation (allow faster crawling)
Crawl-delay: 0.2

# Specify sitemap location
Sitemap: ${SITE_DOMAIN}/sitemap.xml
Sitemap: ${SITE_DOMAIN}/rss.xml

# Host specification
Host: ${SITE_DOMAIN}

# Google bot optimization settings
User-agent: Googlebot
Allow: /
Crawl-delay: 0.2

# Naver bot settings
User-agent: Yeti
Allow: /
Crawl-delay: 0.5

# Bing bot settings
User-agent: bingbot
Allow: /
Crawl-delay: 0.3`;

    console.log('robots.txt content generated, length:', robotsContent.length);

    const response = new Response(robotsContent, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });

    console.log('robots.txt response created successfully');
    return response;
    
  } catch (error) {
    console.error('robots.txt generation error:', error);
    return new Response(
      'User-agent: *\nAllow: /',
      {
        status: 500,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      }
    );
  }
});