
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
}

const categoryInfo: Record<string, CategoryInfo> = {
  "ai-news": {
    title: "AI 뉴스 - 최신 인공지능 소식",
    description: "인공지능 업계의 최신 뉴스와 동향을 실시간으로 업데이트합니다. AI 기술 발전, 기업 동향, 정책 변화 등을 다룹니다.",
    keywords: "AI 뉴스, 인공지능 뉴스, AI 업계 동향, 인공지능 기술, AI 정책, 머신러닝 뉴스"
  },
  "tech-reviews": {
    title: "기술 리뷰 - AI 도구 및 서비스 분석",
    description: "최신 AI 도구, 서비스, 플랫폼에 대한 상세한 리뷰와 분석을 제공합니다.",
    keywords: "AI 도구 리뷰, AI 서비스 분석, 기술 리뷰, AI 플랫폼 비교, 인공지능 도구"
  },
  "tutorials": {
    title: "AI 튜토리얼 - 단계별 가이드",
    description: "AI 기술 활용을 위한 실용적인 튜토리얼과 가이드를 제공합니다.",
    keywords: "AI 튜토리얼, 인공지능 가이드, AI 사용법, 머신러닝 튜토리얼, AI 개발 가이드"
  },
  "chatgpt-guides": {
    title: "ChatGPT 가이드 - 효과적인 활용법",
    description: "ChatGPT와 GPT 모델을 효과적으로 활용하는 방법과 팁을 공유합니다.",
    keywords: "ChatGPT 가이드, GPT 활용법, ChatGPT 팁, AI 챗봇 사용법, OpenAI GPT"
  },
  "lovable-dev": {
    title: "Lovable DEV - AI 앱 개발 가이드",
    description: "Lovable DEV 플랫폼을 활용한 AI 앱 개발 방법과 노하우를 제공합니다.",
    keywords: "Lovable DEV, AI 앱 개발, 노코드 개발, 웹앱 개발, AI 개발 도구"
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
    "name": categoryData.title,
    "description": categoryData.description,
    "url": `${SITE_DOMAIN}/blog/${category}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": posts.length,
      "itemListElement": posts.map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": post.slug ? `${SITE_DOMAIN}/blog/${post.slug}` : `${SITE_DOMAIN}/blog/post/${post.id}`
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
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={categoryData.title}
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
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {categoryData.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              {categoryData.description}
            </p>
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
              <p className="text-gray-600">이 카테고리에는 아직 포스트가 없습니다.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
