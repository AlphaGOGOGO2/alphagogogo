
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { getBlogPostsByCategory } from "@/services/blogPostService";
import { BlogPost } from "@/types/blog";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const SITE_DOMAIN = 'https://alphagogogo.com';

interface CategoryInfo {
  title: string;
  description: string;
  keywords: string;
  icon: string;
  color: string;
}

const categoryInfo: Record<string, CategoryInfo> = {
  "ai-news": {
    title: "AI 뉴스",
    description: "인공지능 업계의 최신 뉴스와 동향을 실시간으로 업데이트합니다. AI 기술 발전, 기업 동향, 정책 변화 등 최신 AI 소식을 확인하세요.",
    keywords: "AI 뉴스, 인공지능 뉴스, AI 업계 동향, 인공지능 기술, AI 정책, 머신러닝 뉴스, ChatGPT 뉴스, Claude 뉴스, Gemini 뉴스, AI 기업 동향",
    icon: "📰",
    color: "from-blue-500 to-blue-600"
  },
  "tech-reviews": {
    title: "기술 리뷰",
    description: "최신 AI 도구, 서비스, 플랫폼에 대한 상세한 리뷰와 분석을 제공합니다. 실제 사용 후기와 비교 분석으로 최적의 AI 도구 선택을 도와드립니다.",
    keywords: "AI 도구 리뷰, AI 서비스 분석, 기술 리뷰, AI 플랫폼 비교, 인공지능 도구, ChatGPT 리뷰, Claude 리뷰, Midjourney 리뷰, AI 도구 추천",
    icon: "⭐",
    color: "from-green-500 to-green-600"
  },
  "tutorials": {
    title: "AI 튜토리얼",
    description: "AI 기술 활용을 위한 실용적인 튜토리얼과 가이드를 제공합니다. 초보자부터 전문가까지 단계별로 AI를 학습하고 활용할 수 있습니다.",
    keywords: "AI 튜토리얼, 인공지능 가이드, AI 사용법, 머신러닝 튜토리얼, AI 개발 가이드, ChatGPT 사용법, 프롬프트 엔지니어링, AI 학습",
    icon: "📚",
    color: "from-purple-500 to-purple-600"
  },
  "chatgpt-guides": {
    title: "ChatGPT 가이드",
    description: "ChatGPT와 GPT 모델을 효과적으로 활용하는 방법과 팁을 공유합니다. 프롬프트 엔지니어링부터 실무 활용까지 완벽한 ChatGPT 활용 가이드입니다.",
    keywords: "ChatGPT 가이드, GPT 활용법, ChatGPT 팁, AI 챗봇 사용법, OpenAI GPT, 프롬프트 작성법, GPT-4 사용법, Custom GPT, ChatGPT 실무 활용",
    icon: "🤖",
    color: "from-orange-500 to-orange-600"
  },
  "lovable-dev": {
    title: "Lovable DEV",
    description: "Lovable DEV 플랫폼을 활용한 AI 앱 개발 방법과 노하우를 제공합니다. 노코드로 전문적인 웹앱을 만드는 모든 과정을 상세히 안내합니다.",
    keywords: "Lovable DEV, AI 앱 개발, 노코드 개발, 웹앱 개발, AI 개발 도구, 러버블 개발, 앱 제작, 웹 개발, 노코드 플랫폼",
    icon: "💻",
    color: "from-pink-500 to-pink-600"
  }
};

export function BlogCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const categoryData = category ? categoryInfo[category] : null;
  
  useEffect(() => {
    const fetchPosts = async () => {
      if (!category) return;
      
      try {
        setIsLoading(true);
        const categoryPosts = await getBlogPostsByCategory(category);
        setPosts(categoryPosts);
      } catch (error) {
        console.error("카테고리 포스트 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, [category]);
  
  if (!category || !categoryData) {
    return <div>잘못된 카테고리입니다.</div>;
  }
  
  // 구조화 데이터
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${categoryData.title} - 알파고고고`,
    "description": categoryData.description,
    "url": `${SITE_DOMAIN}/blog/${category}`,
    "inLanguage": "ko-KR",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": posts.length,
      "itemListElement": posts.map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": post.slug ? `${SITE_DOMAIN}/blog/${post.slug}` : `${SITE_DOMAIN}/blog/post/${post.id}`,
        "name": post.title,
        "description": post.excerpt
      }))
    },
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
          "name": categoryData.title,
          "item": `${SITE_DOMAIN}/blog/${category}`
        }
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "알파고고고",
      "logo": {
        "@type": "ImageObject",
        "url": "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images/logo.png"
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={`${categoryData.title} - 알파고고고`}
        description={categoryData.description}
        canonicalUrl={`/blog/${category}`}
        keywords={categoryData.keywords}
        structuredData={structuredData}
        ogType="website"
      />
      
      <Navbar />
      
      <main className="flex-1 py-12 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${categoryData.color} text-white mb-4`}>
              <span className="text-lg">{categoryData.icon}</span>
              <span className="text-sm font-medium">{category.toUpperCase()}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {categoryData.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              {categoryData.description}
            </p>
            
            {posts.length > 0 && (
              <div className="mt-4 text-sm text-gray-500">
                총 {posts.length}개의 글이 있습니다.
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((placeholder) => (
                <div key={placeholder} className="h-96 bg-gray-100 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <BlogGrid posts={posts} />
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">아직 글이 없습니다</h3>
              <p className="text-gray-600">이 카테고리에는 아직 포스트가 없습니다. 곧 유용한 콘텐츠를 준비해드릴게요!</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
