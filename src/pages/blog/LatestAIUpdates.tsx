
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { BlogGridAnimation } from "@/components/blog/BlogGridAnimation";
import { useQuery } from "@tanstack/react-query";
import { getBlogPostsByCategory } from "@/services/blogService";
import { Skeleton } from "@/components/ui/skeleton";

export default function LatestAIUpdates() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts", "최신 AI소식", Date.now()], // 현재 시간 추가로 캐싱 제한
    queryFn: () => getBlogPostsByCategory("최신 AI소식"),
    staleTime: 30000, // 30초 동안 데이터 유지
    refetchOnWindowFocus: false,
    retry: 1 // 재시도 횟수 제한
  });
  
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
