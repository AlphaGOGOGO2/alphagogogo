
import { useEffect, useState } from "react";
import { getAllBlogPosts } from "@/services/blogPostService";
import { BlogPost } from "@/types/blog";
import { stripMarkdown, generateExcerpt } from "@/utils/blogUtils";

const SITE_DOMAIN = 'https://alphagogogo.com';

export default function RSSPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getAllBlogPosts();
        // 최신 20개 포스트만 RSS에 포함
        setPosts(allPosts.slice(0, 20));
      } catch (error) {
        console.error("RSS용 포스트 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const generateRSS = () => {
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
    <atom:link href="${SITE_DOMAIN}/api/rss" rel="self" type="application/rss+xml"/>
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

        posts.forEach(post => {
          const postUrl = post.slug ? 
            `${SITE_DOMAIN}/blog/${post.slug}` : 
            `${SITE_DOMAIN}/blog/post/${post.id}`;
          
          const pubDate = new Date(post.publishedAt).toUTCString();
          const description = generateExcerpt(post.content, 300);
          const cleanContent = stripMarkdown(post.content);

          rssXml += `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${description}]]></description>
      <content:encoded><![CDATA[${cleanContent}]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      <author>support@alphagogogo.com (${post.author.name})</author>
      <category><![CDATA[${post.category}]]></category>`;

          if (post.coverImage) {
            rssXml += `
      <enclosure url="${post.coverImage}" type="image/jpeg"/>`;
          }

          if (post.tags && post.tags.length > 0) {
            post.tags.forEach(tag => {
              rssXml += `
      <category><![CDATA[${tag}]]></category>`;
            });
          }

          rssXml += `
    </item>`;
        });

        rssXml += `
  </channel>
</rss>`;

        // RSS XML 다운로드
        const blob = new Blob([rssXml], { type: 'application/rss+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rss.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };

      generateRSS();
    }
  }, [isLoading, posts]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">RSS 피드 생성</h1>
        
        {isLoading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">RSS 피드를 생성하고 있습니다...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">RSS 피드 생성 완료</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• 포함된 포스트: {posts.length}개 (최신순)</p>
              <p>• 피드 제목: 알파고고고 - 최신 AI 소식 & 인사이트</p>
              <p>• 언어: 한국어 (ko-KR)</p>
              <p>• 생성 시간: {new Date().toLocaleString('ko-KR')}</p>
            </div>
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800">✅ RSS 피드가 자동으로 다운로드되었습니다.</p>
              <p className="text-sm text-green-600 mt-1">
                이 파일을 서버에 업로드하거나 RSS 구독 서비스에 등록하세요.
              </p>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">RSS 피드 URL:</p>
              <p className="text-sm text-blue-600 mt-1 font-mono">
                {SITE_DOMAIN}/api/rss
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
