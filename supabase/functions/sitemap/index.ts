import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const SITE_DOMAIN = 'https://alphagogogo.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// XML 특수문자 이스케이프 함수
function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Sitemap generation started');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // 모든 게시글 조회
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('*')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false });

    if (postsError) {
      console.error('Posts query error:', postsError);
      throw postsError;
    }

    console.log(`Found ${posts?.length || 0} blog posts`);

    // 모든 리소스 조회
    const { data: resources, error: resourcesError } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (resourcesError) {
      console.error('Resources query error:', resourcesError);
      throw resourcesError;
    }

    console.log(`Found ${resources?.length || 0} resources`);

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
      { url: '/resources', priority: '0.8', changefreq: 'daily' },
      { url: '/community', priority: '0.6', changefreq: 'daily' },
      { url: '/blog-button-creator', priority: '0.6', changefreq: 'monthly' },
      { url: '/business-inquiry', priority: '0.5', changefreq: 'monthly' }
    ];

    const today = new Date().toISOString().split('T')[0];

    // XML 생성 시작
    const xmlLines: string[] = [];
    xmlLines.push('<?xml version="1.0" encoding="UTF-8"?>');
    xmlLines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">');

    // 정적 페이지들 추가
    staticUrls.forEach(({ url, priority, changefreq }) => {
      xmlLines.push('  <url>');
      xmlLines.push(`    <loc>${escapeXml(SITE_DOMAIN + url)}</loc>`);
      xmlLines.push(`    <lastmod>${today}</lastmod>`);
      xmlLines.push(`    <changefreq>${changefreq}</changefreq>`);
      xmlLines.push(`    <priority>${priority}</priority>`);
      xmlLines.push('  </url>');
    });

    // 블로그 포스트들 추가
    if (posts && posts.length > 0) {
      posts.forEach(post => {
        const postUrl = (post.slug && post.slug.trim() !== '') ? 
          `/blog/${post.slug}` : 
          `/blog/post/${post.id}`;
        
        const lastmod = post.updated_at ? 
          new Date(post.updated_at).toISOString().split('T')[0] : 
          new Date(post.published_at).toISOString().split('T')[0];

        // 카테고리별 우선순위 설정
        const priority = getCategoryPriority(post.category);
        const changefreq = getCategoryChangefreq(post.category);

        xmlLines.push('  <url>');
        xmlLines.push(`    <loc>${escapeXml(SITE_DOMAIN + postUrl)}</loc>`);
        xmlLines.push(`    <lastmod>${lastmod}</lastmod>`);
        xmlLines.push(`    <changefreq>${changefreq}</changefreq>`);
        xmlLines.push(`    <priority>${priority}</priority>`);

        // 이미지가 있는 경우 추가
        if (post.cover_image) {
          xmlLines.push('    <image:image>');
          xmlLines.push(`      <image:loc>${escapeXml(post.cover_image)}</image:loc>`);
          xmlLines.push(`      <image:title>${escapeXml(post.title || '')}</image:title>`);
          if (post.excerpt) {
            xmlLines.push(`      <image:caption>${escapeXml(post.excerpt)}</image:caption>`);
          }
          xmlLines.push('    </image:image>');
        }

        xmlLines.push('  </url>');
      });
    }

    // 리소스들 추가
    if (resources && resources.length > 0) {
      resources.forEach(resource => {
        const resourceUrl = `/resources/${resource.id}`;
        const lastmod = resource.updated_at ? 
          new Date(resource.updated_at).toISOString().split('T')[0] : 
          new Date(resource.created_at).toISOString().split('T')[0];

        xmlLines.push('  <url>');
        xmlLines.push(`    <loc>${escapeXml(SITE_DOMAIN + resourceUrl)}</loc>`);
        xmlLines.push(`    <lastmod>${lastmod}</lastmod>`);
        xmlLines.push('    <changefreq>monthly</changefreq>');
        xmlLines.push('    <priority>0.6</priority>');
        xmlLines.push('  </url>');
      });
    }

    xmlLines.push('</urlset>');

    const sitemapContent = xmlLines.join('\n');
    
    console.log(`Sitemap generated with ${xmlLines.length} lines`);
    console.log(`Total URLs: ${staticUrls.length + (posts?.length || 0) + (resources?.length || 0)}`);

    return new Response(sitemapContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Sitemap generation error:', error);
    
    // 최소한의 사이트맵 반환
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_DOMAIN}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new Response(fallbackSitemap, {
      status: 200, // 200으로 반환하여 에러가 아닌 것처럼 처리
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
      },
    });
  }
});

// 카테고리별 변경 빈도 설정 함수
function getCategoryChangefreq(category: string): string {
  const changefreqMap: { [key: string]: string } = {
    'AI 뉴스': 'daily',
    '최신 업데이트': 'daily', 
    '트렌딩': 'daily',
    '테크 리뷰': 'weekly',
    '튜토리얼': 'weekly',
    'ChatGPT 가이드': 'weekly',
    '러브블 개발': 'weekly',
    '라이프스타일': 'weekly'
  };
  return changefreqMap[category] || 'weekly';
}

// 카테고리별 우선순위 설정 함수
function getCategoryPriority(category: string): string {
  const priorityMap: { [key: string]: string } = {
    'AI 뉴스': '0.9',
    '최신 업데이트': '0.9',
    '트렌딩': '0.8',
    '테크 리뷰': '0.7',
    '튜토리얼': '0.8',
    'ChatGPT 가이드': '0.7',
    '러브블 개발': '0.6',
    '라이프스타일': '0.5'
  };
  return priorityMap[category] || '0.6';
}