
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { blogPosts } from "@/data/blogPosts";

export default function AllBlogPage() {
  return (
    <BlogLayout title="블로그">
      <BlogGrid posts={blogPosts} />
    </BlogLayout>
  );
}
