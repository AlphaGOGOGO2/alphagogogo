
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SITE_DOMAIN = 'https://alphagogogo.com';

// XML 특수문자 이스케이프 함수
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// HTML 태그를 제거하고 텍스트만 추출
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
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

    console.log('RSS 피드 생성 시작...');

    // 최신 20개 포스트 조회
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('RSS 포스트 조회 에러:', error);
      throw error;
    }

    console.log(`RSS: ${posts?.length || 0}개 포스트 조회됨`);

    const now = new Date();
    const buildDate = now.toUTCString();

    // XML 헤더와 채널 정보
    let rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>알파고고고 - 최신 AI 소식 &amp; 인사이트</title>
    <link>${SITE_DOMAIN}</link>
    <description>최신 AI 뉴스, 연구 및 인사이트로 업데이트하세요. 알파고고고는 인공지능 발전에 대한 최신 정보를 제공합니다.</description>
    <language>ko-KR</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${SITE_DOMAIN}/rss.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>support@alphagogogo.com (알파고고고)</managingEditor>
    <webMaster>support@alphagogogo.com (알파고고고)</webMaster>
    <copyright>Copyright ${now.getFullYear()} 알파고고고. All rights reserved.</copyright>
    <category>Technology</category>
    <category>Artificial Intelligence</category>
    <category>AI News</category>
    <image>
      <url>https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png</url>
      <title>알파고고고</title>
      <link>${SITE_DOMAIN}</link>
      <width>112</width>
      <height>112</height>
    </image>`;

    // 포스트 아이템들 추가
    if (posts && posts.length > 0) {
      for (const post of posts) {
        const postUrl = post.slug ? 
          `${SITE_DOMAIN}/blog/${post.slug}` : 
          `${SITE_DOMAIN}/blog/post/${post.id}`;
        
        const pubDate = new Date(post.published_at).toUTCString();
        const cleanTitle = escapeXml(post.title || '제목 없음');
        
        // description 생성 (HTML 태그 제거 후 길이 제한)
        let description = '';
        if (post.excerpt) {
          description = stripHtml(post.excerpt).substring(0, 300);
        } else if (post.content) {
          description = stripHtml(post.content).substring(0, 300);
        } else {
          description = '설명이 없습니다.';
        }
        description = escapeXml(description + (description.length >= 300 ? '...' : ''));
        
        // content 생성 (HTML 태그 제거)
        const cleanContent = post.content ? escapeXml(stripHtml(post.content)) : '';

        rssContent += `
    <item>
      <title>${cleanTitle}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${description}</description>
      <content:encoded><![CDATA[${cleanContent}]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      <author>support@alphagogogo.com (${escapeXml(post.author_name || '알파고고고')})</author>
      <category>${escapeXml(post.category || '일반')}</category>`;

        if (post.cover_image) {
          rssContent += `
      <enclosure url="${escapeXml(post.cover_image)}" type="image/jpeg"/>`;
        }

        rssContent += `
    </item>`;
      }
    }

    rssContent += `
  </channel>
</rss>`;

    console.log('RSS XML 생성 완료');

    return new Response(rssContent, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('RSS 피드 생성 에러:', error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>알파고고고 - RSS Feed Error</title>
    <description>RSS 피드 생성 중 오류가 발생했습니다.</description>
  </channel>
</rss>`,
      {
        status: 500,
        headers: {
          'Content-Type': 'application/rss+xml; charset=utf-8',
          ...corsHeaders,
        },
      }
    );
  }
});
