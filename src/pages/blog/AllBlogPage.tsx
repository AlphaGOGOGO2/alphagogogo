
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { BlogGridAnimation } from "@/components/blog/BlogGridAnimation";
import { useQuery } from "@tanstack/react-query";
import { getAllBlogPosts } from "@/services/blogService";
import { Loader2 } from "lucide-react";

export default function AllBlogPage() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: getAllBlogPosts
  });
  
  return (
    <BlogLayout title="블로그">
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
