import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SITE_DOMAIN = 'https://alphagogogo.com';

// XML 특수문자 이스케이프 함수
function escapeXml(unsafe: string): string {
  return unsafe ? unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  }) : '';
}

serve(async (req) => {
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
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('*')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false });

    if (postsError) {
      console.error('Sitemap 포스트 조회 에러:', postsError);
    }

    // 모든 리소스 조회
    const { data: resources, error: resourcesError } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (resourcesError) {
      console.error('Sitemap 리소스 조회 에러:', resourcesError);
    }

    console.log(`사이트맵: ${posts?.length || 0}개 포스트, ${resources?.length || 0}개 리소스 조회됨`);

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

    // XML 시작 (완전히 첫 문자부터)
    let sitemapContent = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';

    // 정적 페이지들 추가
    for (const { url, priority, changefreq } of staticUrls) {
      sitemapContent += '<url><loc>' + escapeXml(SITE_DOMAIN + url) + '</loc><lastmod>' + today + '</lastmod><changefreq>' + changefreq + '</changefreq><priority>' + priority + '</priority></url>';
    }

    // 블로그 포스트들 추가
    if (posts && posts.length > 0) {
      for (const post of posts) {
        // slug가 있으면 slug 기반 URL, 없으면 ID 기반 URL
        const postUrl = (post.slug && post.slug.trim() !== '') ? 
          `/blog/${post.slug}` : 
          `/blog/post/${post.id}`;
        const lastmod = post.updated_at ? 
          new Date(post.updated_at).toISOString().split('T')[0] : 
          new Date(post.published_at).toISOString().split('T')[0];

        // 카테고리별 변경 빈도 설정
        const categoryChangefreq = getCategoryChangefreq(post.category);
        const categoryPriority = getCategoryPriority(post.category);

        sitemapContent += '<url><loc>' + escapeXml(SITE_DOMAIN + postUrl) + '</loc><lastmod>' + lastmod + '</lastmod><changefreq>' + categoryChangefreq + '</changefreq><priority>' + categoryPriority + '</priority>';

        // 이미지 처리 개선 - cover_image가 없어도 기본 이미지 포함
        const imageUrl = post.cover_image || getCategoryThumbnail(post.category);
        if (imageUrl && imageUrl.trim() !== '') {
          sitemapContent += '<image:image><image:loc>' + escapeXml(imageUrl) + '</image:loc><image:title>' + escapeXml(post.title || '') + '</image:title><image:caption>' + escapeXml(post.excerpt || post.title || '') + '</image:caption></image:image>';
        }

        sitemapContent += '</url>';
      }
    }

    // 리소스들 추가
    if (resources && resources.length > 0) {
      for (const resource of resources) {
        const resourceUrl = `/resources/${resource.id}`;
        const lastmod = resource.updated_at ? 
          new Date(resource.updated_at).toISOString().split('T')[0] : 
          new Date(resource.created_at).toISOString().split('T')[0];

        sitemapContent += '<url><loc>' + escapeXml(SITE_DOMAIN + resourceUrl) + '</loc><lastmod>' + lastmod + '</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>';
      }
    }

    sitemapContent += '</urlset>';

    console.log(`사이트맵 XML 생성 완료 - 정적 페이지: ${staticUrls.length}개, 포스트: ${posts?.length || 0}개, 리소스: ${resources?.length || 0}개`);

    return new Response(sitemapContent, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Sitemap 생성 에러:', error);
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>' + SITE_DOMAIN + '</loc><lastmod>' + new Date().toISOString().split('T')[0] + '</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url></urlset>',
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
  return changefreqMap[category] || 'monthly';
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

// 카테고리별 기본 썸네일 이미지 제공 함수
function getCategoryThumbnail(category: string): string {
  const thumbnails: { [key: string]: string } = {
    'AI 뉴스': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80',
    '테크 리뷰': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80',
    '튜토리얼': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80',
    'ChatGPT 가이드': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80',
    '러브블 개발': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80',
    '최신 업데이트': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80',
    '트렌딩': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80',
    '라이프스타일': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80'
  };
  
  return thumbnails[category] || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80';
}