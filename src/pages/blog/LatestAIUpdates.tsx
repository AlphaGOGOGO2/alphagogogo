
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { getPostsByCategory } from "@/data/blogPosts";

export default function LatestAIUpdates() {
  const posts = getPostsByCategory("최신 AI소식");
  
  return (
    <BlogLayout title="최신 AI소식">
      <BlogGrid posts={posts} />
    </BlogLayout>
  );
}
