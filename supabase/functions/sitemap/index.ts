
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SITE_DOMAIN = 'https://alphagogogo.com';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    console.log('사이트맵 생성 시작...');

    // 모든 게시글 조회
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Sitemap 포스트 조회 에러:', error);
      throw error;
    }

    console.log(`사이트맵: ${posts?.length || 0}개 포스트 조회됨`);

    const staticUrls = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/blog', priority: '0.9', changefreq: 'daily' },
      { url: '/blog/ai-news', priority: '0.8', changefreq: 'daily' },
      { url: '/blog/tech-reviews', priority: '0.7', changefreq: 'weekly' },
      { url: '/blog/tutorials', priority: '0.7', changefreq: 'weekly' },
      { url: '/blog/chatgpt-guides', priority: '0.7', changefreq: 'weekly' },
      { url: '/blog/lovable-dev', priority: '0.7', changefreq: 'weekly' },
      { url: '/blog/latest-updates', priority: '0.8', changefreq: 'daily' },
      { url: '/blog/trending', priority: '0.8', changefreq: 'daily' },
      { url: '/blog/lifestyle', priority: '0.7', changefreq: 'weekly' },
      { url: '/gpts', priority: '0.7', changefreq: 'weekly' },
      { url: '/services', priority: '0.7', changefreq: 'monthly' },
      { url: '/community', priority: '0.6', changefreq: 'daily' },
      { url: '/blog-button-creator', priority: '0.6', changefreq: 'monthly' },
      { url: '/business-inquiry', priority: '0.5', changefreq: 'monthly' }
    ];

    const today = new Date().toISOString().split('T')[0];

    // XML 생성
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${staticUrls.map(({ url, priority, changefreq }) => `
  <url>
    <loc>${SITE_DOMAIN}${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('')}${posts && posts.length > 0 ? posts.map(post => {
      const postUrl = post.slug ? `/blog/${post.slug}` : `/blog/post/${post.id}`;
      const lastmod = post.updated_at ? 
        new Date(post.updated_at).toISOString().split('T')[0] : 
        new Date(post.published_at).toISOString().split('T')[0];

      return `
  <url>
    <loc>${SITE_DOMAIN}${postUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>${post.cover_image ? `
    <image:image>
      <image:loc>${post.cover_image}</image:loc>
      <image:title>${post.title}</image:title>
      <image:caption>${post.excerpt || post.title}</image:caption>
    </image:image>` : ''}
  </url>`;
    }).join('') : ''}
</urlset>`;

    console.log(`사이트맵 XML 생성 완료 - 정적 페이지: ${staticUrls.length}개, 포스트: ${posts?.length || 0}개`);

    return new Response(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Sitemap 생성 에러:', error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_DOMAIN}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`,
      {
        status: 500,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          ...corsHeaders,
        },
      }
    );
  }
});
