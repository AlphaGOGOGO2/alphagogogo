
import { BlogPost } from "@/types/blog";
import { MemoizedBlogCard } from "@/components/optimization/MemoizedBlogCard";

interface BlogGridProps {
  posts: BlogPost[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 px-4 sm:px-0">
      {posts.map((post, index) => (
        <MemoizedBlogCard
          key={post.id}
          post={post}
          priority={index < 3} // 첫 3개 카드는 우선순위 높음
        />
      ))}
    </div>
  );
}
