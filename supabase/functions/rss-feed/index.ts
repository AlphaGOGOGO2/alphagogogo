import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

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

// HTML 태그를 제거하고 텍스트만 추출
function stripHtml(html: string): string {
  return html ? html.replace(/<[^>]*>/g, '').trim() : '';
}

// 마크다운 제거 함수 개선
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

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // 모든 발행된 포스트 조회 (제한 없음)
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false });

    if (error) {
      throw error;
    }

    const now = new Date();
    const buildDate = now.toUTCString();

    // XML 시작 (올바른 형식으로)
    const xmlLines: string[] = [];
    xmlLines.push('<?xml version="1.0" encoding="UTF-8"?>');
    xmlLines.push('<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">');
    xmlLines.push('  <channel>');
    xmlLines.push('    <title>알파고고고 - 최신 AI 소식 &amp; 인사이트</title>');
    xmlLines.push(`    <link>${SITE_DOMAIN}</link>`);
    xmlLines.push('    <description>최신 AI 뉴스, 연구 및 인사이트로 업데이트하세요. 알파고고고는 인공지능 발전에 대한 최신 정보를 제공합니다.</description>');
    xmlLines.push('    <language>ko-KR</language>');
    xmlLines.push(`    <lastBuildDate>${buildDate}</lastBuildDate>`);
    xmlLines.push(`    <pubDate>${buildDate}</pubDate>`);
    xmlLines.push('    <ttl>60</ttl>');
    xmlLines.push(`    <atom:link href="${SITE_DOMAIN}/rss.xml" rel="self" type="application/rss+xml"/>`);
    xmlLines.push('    <managingEditor>support@alphagogogo.com (알파고고고)</managingEditor>');
    xmlLines.push('    <webMaster>support@alphagogogo.com (알파고고고)</webMaster>');
    xmlLines.push(`    <copyright>Copyright ${now.getFullYear()} 알파고고고. All rights reserved.</copyright>`);
    xmlLines.push('    <category>Technology</category>');
    xmlLines.push('    <category>Artificial Intelligence</category>');
    xmlLines.push('    <category>AI News</category>');
    xmlLines.push('    <category>Korean AI Blog</category>');
    xmlLines.push('    <image>');
    xmlLines.push('      <url>https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images/logo.png</url>');
    xmlLines.push('      <title>알파고고고</title>');
    xmlLines.push(`      <link>${SITE_DOMAIN}</link>`);
    xmlLines.push('      <width>112</width>');
    xmlLines.push('      <height>112</height>');
    xmlLines.push('    </image>');

    // 포스트 아이템들 추가
    if (posts && posts.length > 0) {
      for (const post of posts) {
        // slug가 있으면 slug 기반 URL, 없으면 ID 기반 URL
        const postUrl = (post.slug && post.slug.trim() !== '') ? 
          `${SITE_DOMAIN}/blog/${post.slug}` : 
          `${SITE_DOMAIN}/blog/post/${post.id}`;
        
        const pubDate = new Date(post.published_at).toUTCString();
        const cleanTitle = escapeXml(post.title || '제목 없음');
        
        // description 생성 (마크다운과 HTML 태그 제거 후 길이 제한)
        let description = '';
        if (post.excerpt) {
          description = stripHtml(stripMarkdown(post.excerpt)).substring(0, 300);
        } else if (post.content) {
          description = stripHtml(stripMarkdown(post.content)).substring(0, 300);
        } else {
          description = '설명이 없습니다.';
        }
        description = escapeXml(description + (description.length >= 300 ? '...' : ''));
        
        // content 생성 (마크다운과 HTML 태그 제거)
        const cleanContent = post.content ? escapeXml(stripHtml(stripMarkdown(post.content))) : '';

        xmlLines.push('    <item>');
        xmlLines.push(`      <title>${cleanTitle}</title>`);
        xmlLines.push(`      <link>${postUrl}</link>`);
        xmlLines.push(`      <guid isPermaLink="true">${postUrl}</guid>`);
        xmlLines.push(`      <description>${description}</description>`);
        xmlLines.push(`      <content:encoded><![CDATA[${cleanContent}]]></content:encoded>`);
        xmlLines.push(`      <pubDate>${pubDate}</pubDate>`);
        xmlLines.push(`      <dc:creator><![CDATA[${escapeXml(post.author_name || '알파고고고')}]]></dc:creator>`);
        xmlLines.push(`      <category><![CDATA[${escapeXml(post.category || '일반')}]]></category>`);

        if (post.cover_image) {
          xmlLines.push(`      <enclosure url="${escapeXml(post.cover_image)}" type="image/jpeg" length="0"/>`);
        }

        xmlLines.push('    </item>');
      }
    }

    xmlLines.push('  </channel>');
    xmlLines.push('</rss>');

    const rssContent = xmlLines.join('\n');

    return new Response(rssContent, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=600', // 10분 캐시
      },
    });
  } catch (error) {
    console.error('RSS 피드 생성 에러:', error);
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>알파고고고 - RSS Feed Error</title><description>RSS 피드 생성 중 오류가 발생했습니다.</description><item><title>서비스 일시 중단</title><description>RSS 피드를 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</description><pubDate>' + new Date().toUTCString() + '</pubDate></item></channel></rss>',
      {
        status: 500,
        headers: {
          'Content-Type': 'application/rss+xml; charset=utf-8',
        },
      }
    );
  }
});