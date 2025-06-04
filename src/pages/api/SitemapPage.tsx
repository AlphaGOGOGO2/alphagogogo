
import { useEffect, useState } from "react";
import { getAllBlogPosts } from "@/services/blogPostService";
import { BlogPost } from "@/types/blog";

const SITE_DOMAIN = 'https://alphagogogo.com';

export default function SitemapPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getAllBlogPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error("사이트맵용 포스트 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // XML 생성
      const generateSitemap = () => {
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

        let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

        // 정적 페이지들 추가
        staticUrls.forEach(({ url, priority, changefreq }) => {
          sitemapXml += `  <url>
    <loc>${SITE_DOMAIN}${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
        });

        // 블로그 포스트들 추가
        posts.forEach(post => {
          const postUrl = post.slug ? `/blog/${post.slug}` : `/blog/post/${post.id}`;
          const lastmod = post.updatedAt ? 
            new Date(post.updatedAt).toISOString().split('T')[0] : 
            new Date(post.publishedAt).toISOString().split('T')[0];

          sitemapXml += `  <url>
    <loc>${SITE_DOMAIN}${postUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>`;

          if (post.coverImage) {
            sitemapXml += `
    <image:image>
      <image:loc>${post.coverImage}</image:loc>
      <image:title>${post.title}</image:title>
      <image:caption>${post.excerpt || post.title}</image:caption>
    </image:image>`;
          }

          sitemapXml += `
  </url>
`;
        });

        sitemapXml += `</urlset>`;

        // 응답 헤더 설정 및 XML 반환
        const response = new Response(sitemapXml, {
          headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600' // 1시간 캐시
          }
        });

        // 브라우저에서 XML 다운로드 트리거
        const blob = new Blob([sitemapXml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };

      generateSitemap();
    }
  }, [isLoading, posts]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">동적 사이트맵 생성</h1>
        
        {isLoading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">사이트맵을 생성하고 있습니다...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">사이트맵 생성 완료</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• 정적 페이지: 15개</p>
              <p>• 블로그 포스트: {posts.length}개</p>
              <p>• 총 URL: {15 + posts.length}개</p>
              <p>• 생성 시간: {new Date().toLocaleString('ko-KR')}</p>
            </div>
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800">✅ 사이트맵이 자동으로 다운로드되었습니다.</p>
              <p className="text-sm text-green-600 mt-1">
                이 파일을 웹마스터 도구에 제출하거나 서버의 루트 디렉토리에 업로드하세요.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
