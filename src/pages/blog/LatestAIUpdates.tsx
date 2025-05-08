
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { BlogGridAnimation } from "@/components/blog/BlogGridAnimation";
import { useQuery } from "@tanstack/react-query";
import { getBlogPostsByCategory } from "@/services/blogPostService";
import { Skeleton } from "@/components/ui/skeleton";
import { SEO } from "@/components/SEO";

// 사이트 기본 도메인
const SITE_DOMAIN = 'https://alphagogogo.com';

export default function LatestAIUpdates() {
  // 더 명확한 캐시 키 사용 및 재시도 설정
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts", "최신 AI소식"],
    queryFn: () => getBlogPostsByCategory("최신 AI소식"),
    staleTime: 10000, // 10초 동안 데이터 유지
    refetchOnWindowFocus: true, // 화면 포커스시 새로고침 활성화
    retry: 2, // 실패시 2번 더 시도
  });
  
  console.log("[LatestAIUpdates] 로딩 상태:", isLoading, "포스트 수:", posts?.length);

  // 페이지에 대한 구조화 데이터 준비
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "최신 AI소식",
    "description": "인공지능 분야의 최신 소식과 업데이트를 확인하세요. AI 기술 발전과 관련된 최신 뉴스와 정보를 제공합니다.",
    "url": `${SITE_DOMAIN}/blog/latest-updates`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "알파고고고",
      "url": SITE_DOMAIN
    },
    "keywords": "최신 AI소식,AI 뉴스,인공지능 최신소식,인공지능 뉴스,AI 기술 발전,알파고고고,알파고,알파GOGOGO,블로그,AI,인공지능"
  };

  // breadcrumb 데이터 추가
  const breadcrumbSchema = {
    "@context": "https://schema.org",
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
        "name": "최신 AI소식",
        "item": `${SITE_DOMAIN}/blog/latest-updates`
      }
    ]
  };
  
  // 구조화 데이터 결합
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [structuredData, breadcrumbSchema]
  };
  
  return (
    <BlogLayout title="최신 AI소식">
      <SEO 
        title="최신 AI소식 - 알파고고고"
        description="인공지능 분야의 최신 소식과 업데이트를 확인하세요. AI 기술 발전과 관련된 최신 뉴스와 정보를 제공합니다."
        canonicalUrl={`${SITE_DOMAIN}/blog/latest-updates`}
        structuredData={combinedSchema}
        keywords="최신 AI소식,AI 뉴스,인공지능 최신소식,인공지능 뉴스,AI 기술 발전,알파고고고,알파고,알파GOGOGO,블로그,AI,인공지능"
      />
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium text-gray-700">아직 작성된 AI소식 포스트가 없습니다</h3>
          <p className="text-gray-500 mt-2">첫 번째 글을 작성해보세요!</p>
        </div>
      ) : (
        <BlogGridAnimation posts={posts} />
      )}
    </BlogLayout>
  );
}
