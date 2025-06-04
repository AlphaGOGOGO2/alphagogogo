
import { useEffect, useState } from "react";
import { getBlogPostsByCategory } from "@/services/blogPostService";
import { BlogPost } from "@/types/blog";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { SEO } from "@/components/SEO";
import { Loader2 } from "lucide-react";

const SITE_DOMAIN = 'https://alphagogogo.com';

export default function TechReviewsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const categoryPosts = await getBlogPostsByCategory("기술 리뷰");
        setPosts(categoryPosts);
      } catch (error) {
        console.error("기술 리뷰 포스트 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "기술 리뷰 - AI 도구 및 서비스 분석",
    "description": "최신 AI 도구, 서비스, 플랫폼에 대한 상세한 리뷰와 분석을 제공합니다.",
    "url": `${SITE_DOMAIN}/blog/tech-reviews`,
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
          "name": "기술 리뷰",
          "item": `${SITE_DOMAIN}/blog/tech-reviews`
        }
      ]
    }
  };

  return (
    <BlogLayout title="기술 리뷰">
      <SEO
        title="기술 리뷰 - AI 도구 및 서비스 분석 | 알파고고고"
        description="최신 AI 도구, 서비스, 플랫폼에 대한 상세한 리뷰와 분석을 제공합니다. 실제 사용 후기와 비교 분석으로 최적의 선택을 도와드립니다."
        canonicalUrl="/blog/tech-reviews"
        keywords="AI 도구 리뷰, AI 서비스 분석, 기술 리뷰, AI 플랫폼 비교, 인공지능 도구, ChatGPT 리뷰, Claude 리뷰, Midjourney 리뷰"
        structuredData={structuredData}
      />

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white mb-4">
          <span className="text-lg">⭐</span>
          <span className="text-sm font-medium">TECH REVIEWS</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          기술 리뷰 - AI 도구 및 서비스 분석
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          최신 AI 도구, 서비스, 플랫폼에 대한 상세한 리뷰와 분석을 제공합니다. 실제 사용 후기와 비교 분석으로 최적의 선택을 도와드립니다.
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
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">아직 기술 리뷰가 없습니다</h3>
          <p className="text-gray-600">곧 유용한 AI 도구 리뷰를 준비해드릴게요!</p>
        </div>
      )}
    </BlogLayout>
  );
}
