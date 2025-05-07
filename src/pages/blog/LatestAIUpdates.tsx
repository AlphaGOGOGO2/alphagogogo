
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { BlogGridAnimation } from "@/components/blog/BlogGridAnimation";
import { useQuery } from "@tanstack/react-query";
import { getBlogPostsByCategory } from "@/services/blogService";
import { Skeleton } from "@/components/ui/skeleton";

export default function LatestAIUpdates() {
  // 쿼리 키에 타임스탬프 추가로 캐시를 매번 새로 갱신하도록 설정
  const timestamp = new Date().getTime();
  
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts", "최신 AI소식", timestamp],
    queryFn: () => getBlogPostsByCategory("최신 AI소식"),
    staleTime: 0, // 캐시 지속시간 0으로 설정하여 항상 새로 불러오도록 함
    refetchOnWindowFocus: false,
    retry: 1
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
