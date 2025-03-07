
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { useQuery } from "@tanstack/react-query";
import { getBlogPostsByCategory } from "@/services/blogService";
import { Loader2 } from "lucide-react";

export default function LatestAIUpdates() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts", "최신 AI소식"],
    queryFn: () => getBlogPostsByCategory("최신 AI소식")
  });
  
  return (
    <BlogLayout title="최신 AI소식">
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium text-gray-700">아직 작성된 AI소식 포스트가 없습니다</h3>
          <p className="text-gray-500 mt-2">첫 번째 글을 작성해보세요!</p>
        </div>
      ) : (
        <BlogGrid posts={posts} />
      )}
    </BlogLayout>
  );
}
