
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

    const now = new Date();
    const buildDate = now.toUTCString();

    let rssXml = `<?xml version="1.0" encoding="UTF-8"?>
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
    </image>
`;

    if (posts && posts.length > 0) {
      posts.forEach(post => {
        const postUrl = post.slug ? 
          `${SITE_DOMAIN}/blog/${post.slug}` : 
          `${SITE_DOMAIN}/blog/post/${post.id}`;
        
        const pubDate = new Date(post.published_at).toUTCString();
        const description = post.excerpt || post.content.substring(0, 300).replace(/[<>]/g, '') + '...';
        const cleanContent = post.content.replace(/[<>]/g, '');

        rssXml += `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${description}]]></description>
      <content:encoded><![CDATA[${cleanContent}]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      <author>support@alphagogogo.com (${post.author_name || '알파고고고'})</author>
      <category><![CDATA[${post.category}]]></category>`;

        if (post.cover_image) {
          rssXml += `
      <enclosure url="${post.cover_image}" type="image/jpeg"/>`;
        }

        rssXml += `
    </item>`;
      });
    }

    rssXml += `
  </channel>
</rss>`;

    return new Response(rssXml, {
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
