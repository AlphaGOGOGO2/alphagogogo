
import { useState } from "react";
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { BlogGridAnimation } from "@/components/blog/BlogGridAnimation";
import { useQuery } from "@tanstack/react-query";
import { getAllBlogPosts } from "@/services/blogPostService"; // 직접 import 경로 수정
import { Loader2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";

const POSTS_PER_PAGE = 9;

export default function AllBlogPage() {
  const [visiblePosts, setVisiblePosts] = useState(POSTS_PER_PAGE);
  
  // 현재 타임스탬프를 쿼리 키에 포함시켜 최신 데이터 가져오기
  const timestamp = Date.now();
  
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts", timestamp],
    queryFn: getAllBlogPosts,
    staleTime: 10000, // 10초 동안 데이터 유지
    refetchOnWindowFocus: true // 화면 포커스시 새로고침
  });
  
  console.log("[AllBlogPage] 로딩 상태:", isLoading, "포스트 수:", posts?.length);
  
  const displayedPosts = posts.slice(0, visiblePosts);
  const hasMorePosts = visiblePosts < posts.length;
  
  const handleLoadMore = () => {
    setVisiblePosts(prev => prev + POSTS_PER_PAGE);
  };
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "블로그",
    "description": "알파블로그의 모든 글 모음입니다. 인공지능, 기술, 라이프스타일에 관한 다양한 콘텐츠를 확인하세요.",
    "url": "https://alphablog.app/blog",
    "isPartOf": {
      "@type": "WebSite",
      "name": "알파블로그",
      "url": "https://alphablog.app"
    },
    "keywords": "알파고고고,알파고,알파GOGOGO,유튜브 알파GOGOGO,유튜브 알파고고고,본질을 찾아서,블로그,블로그 자동화,알파블로그,블로그 GPTS,챗GPT,블로그 AI,블로그 GPT,챗지피티,블로그자동,블로그 글쓰기,블로그 AI글,러버블 DEV,Lovable DEV,러버블 DEV 회원가입,러버블 DEV 가격,러버블 DEV 요금제,AI 앱 개발,노코드 웹앱 만들기,AI 웹 개발,러버블 DEV 사용법,AI 앱 만들기,노코드 앱 제작"
  };
  
  return (
    <BlogLayout title="블로그">
      <SEO 
        title="블로그 - 알파블로그"
        description="알파블로그의 모든 글 모음입니다. 인공지능, 기술, 라이프스타일에 관한 다양한 콘텐츠를 확인하세요."
        canonicalUrl="https://alphablog.app/blog"
        structuredData={structuredData}
        keywords="알파고고고,알파고,알파GOGOGO,유튜브 알파GOGOGO,유튜브 알파고고고,본질을 찾아서,블로그,블로그 자동화,알파블로그,블로그 GPTS,챗GPT,블로그 AI,블로그 GPT,챗지피티,블로그자동,블로그 글쓰기,블로그 AI글,러버블 DEV,Lovable DEV,러버블 DEV 회원가입,러버블 DEV 가격,러버블 DEV 요금제,AI 앱 개발,노코드 웹앱 만들기,AI 웹 개발,러버블 DEV 사용법,AI 앱 만들기,노코드 앱 제작"
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium text-gray-700">아직 작성된 블로그 포스트가 없습니다</h3>
          <p className="text-gray-500 mt-2">첫 번째 글을 작성해보세요!</p>
        </div>
      ) : (
        <>
          <BlogGridAnimation posts={displayedPosts} />
          
          {hasMorePosts && (
            <div className="flex justify-center mt-10">
              <Button 
                onClick={handleLoadMore} 
                className="bg-purple-600 hover:bg-purple-700 transition-all"
                aria-label="더 많은 포스트 불러오기"
              >
                더보기 ({posts.length - visiblePosts}개 남음)
              </Button>
            </div>
          )}
        </>
      )}
    </BlogLayout>
  );
}
