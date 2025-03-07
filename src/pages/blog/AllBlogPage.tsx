
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { BlogGridAnimation } from "@/components/blog/BlogGridAnimation";
import { useQuery } from "@tanstack/react-query";
import { getAllBlogPosts } from "@/services/blogService";
import { Loader2 } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function AllBlogPage() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: getAllBlogPosts
  });
  
  // Blog category structured data
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
    "keywords": "알파고고고,알파고,알파GOGOGO,유튜브 알파GOGOGO,유튜브 알파고고고,본질을 찾아서,블로그,블로그 자동화,알파블로그,블로그 GPTS,챗GPT,블로그 AI,블로그 GPT,챗지피티,블로그자동,블로그 글쓰기,블로그 AI글"
  };
  
  return (
    <BlogLayout title="블로그">
      <SEO 
        title="블로그 - 알파블로그"
        description="알파블로그의 모든 글 모음입니다. 인공지능, 기술, 라이프스타일에 관한 다양한 콘텐츠를 확인하세요."
        canonicalUrl="https://alphablog.app/blog"
        structuredData={structuredData}
        keywords="알파고고고,알파고,알파GOGOGO,유튜브 알파GOGOGO,유튜브 알파고고고,본질을 찾아서,블로그,블로그 자동화,알파블로그,블로그 GPTS,챗GPT,블로그 AI,블로그 GPT,챗지피티,블로그자동,블로그 글쓰기,블로그 AI글"
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
        <BlogGridAnimation posts={posts} />
      )}
    </BlogLayout>
  );
}
