
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { BlogGridAnimation } from "@/components/blog/BlogGridAnimation";
import { useQuery } from "@tanstack/react-query";
import { getBlogPostsByCategory } from "@/services/blogPostService"; // 직접 import 경로 수정
import { Skeleton } from "@/components/ui/skeleton";

export default function LatestAIUpdates() {
  // 현재 타임스탬프를 쿼리 키에 포함시켜 최신 데이터 가져오기
  const timestamp = Date.now();
  
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts", "최신 AI소식", timestamp],
    queryFn: () => getBlogPostsByCategory("최신 AI소식"),
    staleTime: 10000, // 10초 동안 데이터 유지 (기존 60초에서 단축)
    refetchOnWindowFocus: true, // 화면 포커스시 새로고침 활성화
  });
  
  console.log("[LatestAIUpdates] 로딩 상태:", isLoading, "포스트 수:", posts?.length);
  
  return (
    <BlogLayout title="최신 AI소식">
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
