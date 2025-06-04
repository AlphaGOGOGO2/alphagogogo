
import { useEffect, useState } from "react";
import { getBlogPostsByCategory } from "@/services/blogPostService";
import { BlogPost } from "@/types/blog";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { SEO } from "@/components/SEO";
import { Loader2 } from "lucide-react";

const SITE_DOMAIN = 'https://alphagogogo.com';

export default function AINewsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const categoryPosts = await getBlogPostsByCategory("최신 AI소식");
        setPosts(categoryPosts);
      } catch (error) {
        console.error("AI 뉴스 포스트 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "AI 뉴스 - 최신 인공지능 소식",
    "description": "인공지능 업계의 최신 뉴스와 동향을 실시간으로 업데이트합니다.",
    "url": `${SITE_DOMAIN}/blog/ai-news`,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "홈",
          "item": SITE_DOMAIN
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "블로그",
          "item": `${SITE_DOMAIN}/blog`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "AI 뉴스",
          "item": `${SITE_DOMAIN}/blog/ai-news`
        }
      ]
    }
  };

  return (
    <BlogLayout title="AI 뉴스">
      <SEO
        title="AI 뉴스 - 최신 인공지능 소식 | 알파고고고"
        description="인공지능 업계의 최신 뉴스와 동향을 실시간으로 업데이트합니다. AI 기술 발전, 기업 동향, 정책 변화 등을 다룹니다."
        canonicalUrl="/blog/ai-news"
        keywords="AI 뉴스, 인공지능 뉴스, AI 업계 동향, 인공지능 기술, AI 정책, 머신러닝 뉴스, ChatGPT 뉴스, Claude 뉴스, Gemini 뉴스"
        structuredData={structuredData}
      />

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white mb-4">
          <span className="text-lg">📰</span>
          <span className="text-sm font-medium">AI NEWS</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          AI 뉴스 - 최신 인공지능 소식
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          인공지능 업계의 최신 뉴스와 동향을 실시간으로 업데이트합니다. AI 기술 발전, 기업 동향, 정책 변화 등을 다룹니다.
        </p>
        
        {posts.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            총 {posts.length}개의 글이 있습니다.
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
        </div>
      ) : posts.length > 0 ? (
        <BlogGrid posts={posts} />
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">아직 AI 뉴스가 없습니다</h3>
          <p className="text-gray-600">곧 최신 인공지능 소식을 업데이트해드릴게요!</p>
        </div>
      )}
    </BlogLayout>
  );
}
