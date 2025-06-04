
import { useEffect, useState } from "react";
import { getBlogPostsByCategory } from "@/services/blogPostService";
import { BlogPost } from "@/types/blog";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { SEO } from "@/components/SEO";
import { Loader2 } from "lucide-react";

const SITE_DOMAIN = 'https://alphagogogo.com';

export default function ChatGPTGuidesPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const categoryPosts = await getBlogPostsByCategory("ChatGPT 가이드");
        setPosts(categoryPosts);
      } catch (error) {
        console.error("ChatGPT 가이드 포스트 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "ChatGPT 가이드 - 효과적인 활용법",
    "description": "ChatGPT와 GPT 모델을 효과적으로 활용하는 방법과 팁을 공유합니다.",
    "url": `${SITE_DOMAIN}/blog/chatgpt-guides`,
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
          "name": "ChatGPT 가이드",
          "item": `${SITE_DOMAIN}/blog/chatgpt-guides`
        }
      ]
    }
  };

  return (
    <BlogLayout title="ChatGPT 가이드">
      <SEO
        title="ChatGPT 가이드 - 효과적인 활용법 | 알파고고고"
        description="ChatGPT와 GPT 모델을 효과적으로 활용하는 방법과 팁을 공유합니다. 프롬프트 엔지니어링부터 실무 활용까지 완벽 가이드입니다."
        canonicalUrl="/blog/chatgpt-guides"
        keywords="ChatGPT 가이드, GPT 활용법, ChatGPT 팁, AI 챗봇 사용법, OpenAI GPT, 프롬프트 작성법, GPT-4 사용법, Custom GPT"
        structuredData={structuredData}
      />

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white mb-4">
          <span className="text-lg">🤖</span>
          <span className="text-sm font-medium">CHATGPT GUIDES</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          ChatGPT 가이드 - 효과적인 활용법
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          ChatGPT와 GPT 모델을 효과적으로 활용하는 방법과 팁을 공유합니다. 프롬프트 엔지니어링부터 실무 활용까지 완벽 가이드입니다.
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
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">아직 ChatGPT 가이드가 없습니다</h3>
          <p className="text-gray-600">곧 유용한 ChatGPT 활용법을 준비해드릴게요!</p>
        </div>
      )}
    </BlogLayout>
  );
}
