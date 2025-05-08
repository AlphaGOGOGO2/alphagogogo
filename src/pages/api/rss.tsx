
import { useEffect, useState } from 'react';
import { getAllBlogPosts } from '@/services/blogPostService';
import { stripMarkdown } from '@/utils/blogUtils';
import { formatDate } from '@/lib/utils';

// 도메인 설정 - 프로덕션에서는 이 도메인을 사용합니다
const SITE_DOMAIN = 'https://alphagogogo.com';

export default function RSSPage() {
  const [xml, setXml] = useState<string>('');

  useEffect(() => {
    const generateRSS = async () => {
      try {
        // 모든 블로그 포스트 가져오기
        const posts = await getAllBlogPosts();
        
        // 현재 날짜를 RFC822 형식으로 포맷팅
        const buildDate = new Date().toUTCString();
        
        // RSS 아이템 생성
        const rssItems = posts.slice(0, 20).map(post => {
          // 발행 날짜 포맷팅
          const pubDate = new Date(post.publishedAt).toUTCString();
          
          // 포스트 URL 생성
          const postUrl = post.slug 
            ? `${SITE_DOMAIN}/blog/${post.slug}` 
            : `${SITE_DOMAIN}/blog/post/${post.id}`;
          
          // 마크다운 제거한 설명 생성
          const description = stripMarkdown(post.excerpt || post.content.substring(0, 300));
          
          return `    <item>
      <title>${escapeXML(post.title)}</title>
      <link>${postUrl}</link>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXML(description)}</description>
      <guid isPermaLink="true">${postUrl}</guid>
      <category>${escapeXML(post.category)}</category>
    </item>`;
        }).join('\n');
        
        // RSS XML 생성
        let rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>알파고고고 - 최신 AI 소식 &amp; 인사이트</title>
    <link>${SITE_DOMAIN}</link>
    <description>최신 AI 뉴스, 연구 및 인사이트로 업데이트하세요. 알파고고고는 인공지능 발전에 대한 최신 정보를 제공합니다.</description>
    <language>ko-kr</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${SITE_DOMAIN}/rss.xml" rel="self" type="application/rss+xml" />
    
${rssItems}
  </channel>
</rss>`;
        
        setXml(rssXml);
      } catch (error) {
        console.error("RSS 생성 중 오류 발생:", error);
        setXml(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>알파고고고 - 최신 AI 소식 &amp; 인사이트</title>
    <link>${SITE_DOMAIN}</link>
    <description>오류로 인해 완전한 RSS를 생성하지 못했습니다</description>
  </channel>
</rss>`);
      }
    };
    
    generateRSS();
  }, []);

  // XML 이스케이프 함수
  function escapeXML(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  // XML 컨텐츠 타입으로 반환
  return (
    <pre style={{ display: 'none' }}>
      {xml}
    </pre>
  );
}

// 서버로 직접 전송될 때 올바른 HTTP 헤더 추가를 위한 getServerSideProps
export async function getServerSideProps({ res }: { res: any }) {
  if (res) {
    res.setHeader('Content-Type', 'application/rss+xml');
  }
  return { props: {} };
}
