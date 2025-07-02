import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const SITE_DOMAIN = 'https://alphagogogo.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

// HTML 태그를 제거하고 텍스트만 추출
function stripHtml(html: string): string {
  return html ? html.replace(/<[^>]*>/g, '').trim() : '';
}

// 마크다운 제거 함수
function stripMarkdown(md: string): string {
  if (!md) return '';
  
  return md
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 이미지 제거
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 링크 텍스트만 남김
    .replace(/`([^`]+)`/g, '$1') // 인라인 코드
    .replace(/```[\s\S]*?```/g, '') // 코드 블록
    .replace(/[*_~>#\-\+]/g, '') // 마크다운 기호
    .replace(/\n+/g, ' ') // 줄바꿈을 공백으로
    .replace(/\s+/g, ' ') // 여러 공백을 하나로
    .trim();
}

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

    // 모든 발행된 포스트 조회
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('*')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false });

    if (postsError) {
      throw postsError;
    }

    // 모든 리소스 조회
    const { data: resources, error: resourcesError } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (resourcesError) {
      throw resourcesError;
    }

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

    // Sitemap XML 생성
    let sitemapContent = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';

    // 정적 페이지들 추가
    for (const { url, priority, changefreq } of staticUrls) {
      sitemapContent += '<url><loc>' + escapeXml(SITE_DOMAIN + url) + '</loc><lastmod>' + today + '</lastmod><changefreq>' + changefreq + '</changefreq><priority>' + priority + '</priority></url>';
    }

    // 블로그 포스트들 추가
    if (posts && posts.length > 0) {
      for (const post of posts) {
        const postUrl = (post.slug && post.slug.trim() !== '') ? 
          `/blog/${post.slug}` : 
          `/blog/post/${post.id}`;
        const lastmod = post.updated_at ? 
          new Date(post.updated_at).toISOString().split('T')[0] : 
          new Date(post.published_at).toISOString().split('T')[0];

        const categoryChangefreq = getCategoryChangefreq(post.category);
        const categoryPriority = getCategoryPriority(post.category);

        sitemapContent += '<url><loc>' + escapeXml(SITE_DOMAIN + postUrl) + '</loc><lastmod>' + lastmod + '</lastmod><changefreq>' + categoryChangefreq + '</changefreq><priority>' + categoryPriority + '</priority>';

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

    // RSS XML 생성
    const now = new Date();
    const buildDate = now.toUTCString();

    let rssContent = '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>알파고고고 - 최신 AI 소식 &amp; 인사이트</title><link>' + SITE_DOMAIN + '</link><description>최신 AI 뉴스, 연구 및 인사이트로 업데이트하세요. 알파고고고는 인공지능 발전에 대한 최신 정보를 제공합니다.</description><language>ko-KR</language><lastBuildDate>' + buildDate + '</lastBuildDate><pubDate>' + buildDate + '</pubDate><ttl>60</ttl><atom:link href="' + SITE_DOMAIN + '/rss.xml" rel="self" type="application/rss+xml"/><managingEditor>support@alphagogogo.com (알파고고고)</managingEditor><webMaster>support@alphagogogo.com (알파고고고)</webMaster><copyright>Copyright ' + now.getFullYear() + ' 알파고고고. All rights reserved.</copyright><category>Technology</category><category>Artificial Intelligence</category><category>AI News</category><category>Korean AI Blog</category><image><url>https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png</url><title>알파고고고</title><link>' + SITE_DOMAIN + '</link><width>112</width><height>112</height></image>';

    // 포스트 아이템들 추가
    if (posts && posts.length > 0) {
      for (const post of posts) {
        const postUrl = (post.slug && post.slug.trim() !== '') ? 
          `${SITE_DOMAIN}/blog/${post.slug}` : 
          `${SITE_DOMAIN}/blog/post/${post.id}`;
        
        const pubDate = new Date(post.published_at).toUTCString();
        const cleanTitle = escapeXml(post.title || '제목 없음');
        
        let description = '';
        if (post.excerpt) {
          description = stripHtml(stripMarkdown(post.excerpt)).substring(0, 300);
        } else if (post.content) {
          description = stripHtml(stripMarkdown(post.content)).substring(0, 300);
        } else {
          description = '설명이 없습니다.';
        }
        description = escapeXml(description + (description.length >= 300 ? '...' : ''));
        
        const cleanContent = post.content ? escapeXml(stripHtml(stripMarkdown(post.content))) : '';

        rssContent += '<item><title>' + cleanTitle + '</title><link>' + postUrl + '</link><guid isPermaLink="true">' + postUrl + '</guid><description>' + description + '</description><content:encoded><![CDATA[' + cleanContent + ']]></content:encoded><pubDate>' + pubDate + '</pubDate><dc:creator><![CDATA[' + escapeXml(post.author_name || '알파고고고') + ']]></dc:creator><category><![CDATA[' + escapeXml(post.category || '일반') + ']]></category>';

        if (post.cover_image) {
          rssContent += '<enclosure url="' + escapeXml(post.cover_image) + '" type="image/jpeg"/>';
        }

        rssContent += '</item>';
      }
    }

    rssContent += '</channel></rss>';

    // 정적 파일로 저장 (Netlify Functions API 사용)
    const updateFiles = async () => {
      // Supabase Storage에 업로드하는 방식으로 구현
      const { error: sitemapError } = await supabase.storage
        .from('public')
        .upload('sitemap.xml', sitemapContent, {
          contentType: 'application/xml',
          upsert: true
        });

      const { error: rssError } = await supabase.storage
        .from('public')
        .upload('rss.xml', rssContent, {
          contentType: 'application/rss+xml',
          upsert: true
        });

      return { sitemapError, rssError };
    };

    const { sitemapError, rssError } = await updateFiles();

    // Google과 Bing에 사이트맵 업데이트 알림
    try {
      const pingPromises = [
        // Google
        fetch(`http://www.google.com/ping?sitemap=${encodeURIComponent(SITE_DOMAIN + '/sitemap.xml')}`),
        // Bing
        fetch(`http://www.bing.com/ping?sitemap=${encodeURIComponent(SITE_DOMAIN + '/sitemap.xml')}`)
      ];

      await Promise.allSettled(pingPromises);
    } catch (pingError) {
      console.log('검색엔진 핑 실패:', pingError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'SEO 파일이 성공적으로 업데이트되었습니다.',
        sitemap_error: sitemapError,
        rss_error: rssError,
        posts_count: posts?.length || 0,
        resources_count: resources?.length || 0,
        updated_at: new Date().toISOString()
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('SEO 파일 업데이트 에러:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'SEO 파일 업데이트 중 오류가 발생했습니다.',
        error: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
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