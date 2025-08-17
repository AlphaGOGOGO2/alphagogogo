
import { useEffect, useState } from "react";
import { getBlogPostsByCategory } from "@/services/blogPostService";
import { BlogPost } from "@/types/blog";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { SEO } from "@/components/SEO";
import { Loader2 } from "lucide-react";

const SITE_DOMAIN = 'https://alphagogogo.com';

export default function LovableDevPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const categoryPosts = await getBlogPostsByCategory("Lovable DEV");
        setPosts(categoryPosts);
      } catch (error) {
        console.error("Lovable DEV 포스트 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Lovable DEV - AI 앱 개발 가이드",
    "description": "Lovable DEV 플랫폼을 활용한 AI 앱 개발 방법과 노하우를 제공합니다.",
    "url": `${SITE_DOMAIN}/blog/lovable-dev`,
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
          "name": "Lovable DEV",
          "item": `${SITE_DOMAIN}/blog/lovable-dev`
        }
      ]
    }
  };

  return (
    <BlogLayout title="Lovable DEV">
      <SEO
        title="Lovable DEV - AI 앱 개발 가이드 | 알파고고고"
        description="Lovable DEV 플랫폼을 활용한 AI 앱 개발 방법과 노하우를 제공합니다. 노코드로 전문적인 웹앱을 만드는 모든 과정을 안내합니다."
        canonicalUrl="/blog/lovable-dev"
        keywords="Lovable DEV, AI 앱 개발, 노코드 개발, 웹앱 개발, AI 개발 도구, 러버블 개발, 앱 제작, 웹 개발"
        structuredData={structuredData}
      />

      <h1 className="sr-only">Lovable DEV - AI 앱 개발 가이드</h1>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white mb-4">
          <span className="text-lg">💻</span>
          <span className="text-sm font-medium">LOVABLE DEV</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          Lovable DEV - AI 앱 개발 가이드
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl">
          Lovable DEV 플랫폼을 활용한 AI 앱 개발 방법과 노하우를 제공합니다. 노코드로 전문적인 웹앱을 만드는 모든 과정을 안내합니다.
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
          <div className="text-6xl mb-4">💻</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">아직 Lovable DEV 가이드가 없습니다</h3>
          <p className="text-gray-600">곧 유용한 앱 개발 가이드를 준비해드릴게요!</p>
        </div>
      )}
    </BlogLayout>
  );
}
