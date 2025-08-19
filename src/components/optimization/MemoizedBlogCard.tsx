import React from "react";
import { BlogPost } from "@/types/blog";
import { BlogCard } from "@/components/blog/BlogCard";

interface MemoizedBlogCardProps {
  post: BlogPost;
  priority?: boolean;
}

// 메모이제이션된 블로그 카드로 리렌더링 최적화
export const MemoizedBlogCard = React.memo(function MemoizedBlogCard({ 
  post, 
  priority = false 
}: MemoizedBlogCardProps) {
  return <BlogCard post={post} priority={priority} />;
}, (prevProps, nextProps) => {
  // 커스텀 비교 함수로 정확한 메모이제이션
  return (
    prevProps.post.id === nextProps.post.id &&
    prevProps.post.title === nextProps.post.title &&
    prevProps.post.updatedAt === nextProps.post.updatedAt &&
    prevProps.priority === nextProps.priority
  );
});