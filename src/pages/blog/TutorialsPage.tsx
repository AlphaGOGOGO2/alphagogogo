
import { useEffect, useState } from "react";
import { getBlogPostsByCategory } from "@/services/blogPostService";
import { BlogPost } from "@/types/blog";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { SEO } from "@/components/SEO";
import { Loader2 } from "lucide-react";

const SITE_DOMAIN = 'https://alphagogogo.com';

export default function TutorialsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const categoryPosts = await getBlogPostsByCategory("튜토리얼");
        setPosts(categoryPosts);
      } catch (error) {
        console.error("튜토리얼 포스트 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "AI 튜토리얼 - 단계별 가이드",
    "description": "AI 기술 활용을 위한 실용적인 튜토리얼과 가이드를 제공합니다.",
    "url": `${SITE_DOMAIN}/blog/tutorials`,
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
          "name": "튜토리얼",
          "item": `${SITE_DOMAIN}/blog/tutorials`
        }
      ]
    }
  };

  return (
    <BlogLayout title="AI 튜토리얼">
      <SEO
        title="AI 튜토리얼 - 단계별 가이드 | 알파고고고"
        description="AI 기술 활용을 위한 실용적인 튜토리얼과 가이드를 제공합니다. 초보자부터 전문가까지 단계별로 학습할 수 있습니다."
        canonicalUrl="/blog/tutorials"
        keywords="AI 튜토리얼, 인공지능 가이드, AI 사용법, 머신러닝 튜토리얼, AI 개발 가이드, ChatGPT 사용법, 프롬프트 엔지니어링"
        structuredData={structuredData}
      />

      <h1 className="sr-only">AI 튜토리얼 - 단계별 가이드</h1>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white mb-4">
          <span className="text-lg">📚</span>
          <span className="text-sm font-medium">TUTORIALS</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          AI 튜토리얼 - 단계별 가이드
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl">
          AI 기술 활용을 위한 실용적인 튜토리얼과 가이드를 제공합니다. 초보자부터 전문가까지 단계별로 학습할 수 있습니다.
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
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">아직 튜토리얼이 없습니다</h3>
          <p className="text-gray-600">곧 유용한 AI 학습 가이드를 준비해드릴게요!</p>
        </div>
      )}
    </BlogLayout>
  );
}
