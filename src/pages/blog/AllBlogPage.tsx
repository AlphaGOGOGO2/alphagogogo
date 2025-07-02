
import { useState } from "react";
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { LazyBlogGrid } from "@/components/blog/LazyBlogGrid";
import { useQuery } from "@tanstack/react-query";
import { getAllBlogPosts } from "@/services/blogPostService";
import { Loader2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const SITE_DOMAIN = 'https://alphagogogo.com';

export default function AllBlogPage() {
  
  
  // 최적화된 캐시 설정과 에러 처리
  const { data: posts = [], isLoading, error, isError } = useQuery({
    queryKey: ["blog-posts", "all", "optimized"],
    queryFn: getAllBlogPosts,
    staleTime: 10 * 60 * 1000, // 10분 캐시 (5분에서 증가)
    retry: (failureCount, error) => {
      console.error(`[AllBlogPage] API 호출 실패 (${failureCount}회):`, error);
      return failureCount < 2; // 최대 2회 재시도
    },
    refetchOnWindowFocus: false, // 불필요한 재요청 방지
    gcTime: 15 * 60 * 1000, // 15분 가비지 컬렉션 시간
  });
  
  
  console.log("[AllBlogPage] 로딩 상태:", isLoading, "포스트 수:", posts?.length, "에러:", isError);
  
  // 페이지에 대한 구조화 데이터 준비
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "블로그",
    "description": "알파블로그의 모든 글 모음입니다. 인공지능, 기술, 라이프스타일에 관한 다양한 콘텐츠를 확인하세요.",
    "url": `${SITE_DOMAIN}/blog`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "알파고고고",
      "url": SITE_DOMAIN
    },
    "keywords": "알파고고고,알파고,알파GOGOGO,유튜브 알파GOGOGO,유튜브 알파고고고,본질을 찾아서,블로그,블로그 자동화,알파블로그,블로그 GPTS,챗GPT,블로그 AI,블로그 GPT,챗지피티,블로그자동,블로그 글쓰기,블로그 AI글,러버블 DEV,Lovable DEV,러버블 DEV 회원가입,러버블 DEV 가격,러버블 DEV 요금제,AI 앱 개발,노코드 웹앱 만들기,AI 웹 개발,러버블 DEV 사용법,AI 앱 만들기,노코드 앱 제작"
  };

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
      }
    ]
  };
  
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [structuredData, breadcrumbSchema]
  };
  
  return (
    <BlogLayout title="블로그">
      <SEO 
        title="블로그 - 알파고고고"
        description="알파고고고의 모든 글 모음입니다. 인공지능, 기술, 라이프스타일에 관한 다양한 콘텐츠를 확인하세요."
        canonicalUrl={`${SITE_DOMAIN}/blog`}
        structuredData={combinedSchema}
        keywords="알파고고고,알파고,알파GOGOGO,유튜브 알파GOGOGO,유튜브 알파고고고,본질을 찾아서,블로그,블로그 자동화,알파블로그,블로그 GPTS,챗GPT,블로그 AI,블로그 GPT,챗지피티,블로그자동,블로그 글쓰기,블로그 AI글,러버블 DEV,Lovable DEV,러버블 DEV 회원가입,러버블 DEV 가격,러버블 DEV 요금제,AI 앱 개발,노코드 웹앱 만들기,AI 웹 개발,러버블 DEV 사용법,AI 앱 만들기,노코드 앱 제작,URL 단축,무료 URL 단축,유튜브 자막,유튜브 자막 다운로드,블로그 버튼 생성,버튼 생성기,링크 버튼 생성,링크 버튼"
      />
      
      <ErrorBoundary>
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-red-700">데이터를 불러오는 중 문제가 발생했습니다</h3>
            <p className="text-red-500 mt-2">잠시 후 다시 시도해주세요.</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-600 hover:bg-red-700"
            >
              새로고침
            </Button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-gray-700">아직 작성된 블로그 포스트가 없습니다</h3>
            <p className="text-gray-500 mt-2">첫 번째 글을 작성해보세요!</p>
          </div>
        ) : (
          <LazyBlogGrid posts={posts} />
        )}
      </ErrorBoundary>
    </BlogLayout>
  );
}
