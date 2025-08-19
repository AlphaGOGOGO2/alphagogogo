import { useState, useMemo, useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import { BlogPost } from "@/types/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { useWindowSize } from "@/hooks/useWindowSize";

interface VirtualizedBlogGridProps {
  posts: BlogPost[];
  itemHeight?: number;
}

export function VirtualizedBlogGrid({ posts, itemHeight = 400 }: VirtualizedBlogGridProps) {
  const { width } = useWindowSize();
  
  // 화면 크기에 따른 컬럼 수 계산
  const columnsCount = useMemo(() => {
    if (width < 768) return 1;
    if (width < 1024) return 2;
    return 3;
  }, [width]);

  // 행으로 그룹화
  const rows = useMemo(() => {
    const result = [];
    for (let i = 0; i < posts.length; i += columnsCount) {
      result.push(posts.slice(i, i + columnsCount));
    }
    return result;
  }, [posts, columnsCount]);

  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const rowPosts = rows[index];
    
    return (
      <div style={style}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {rowPosts.map((post, colIndex) => (
            <BlogCard 
              key={post.id} 
              post={post} 
              priority={index === 0 && colIndex === 0}
            />
          ))}
        </div>
      </div>
    );
  }, [rows]);

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">표시할 포스트가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <List
        height={Math.min(rows.length * itemHeight, window.innerHeight * 2)}
        itemCount={rows.length}
        itemSize={itemHeight}
        width="100%"
        overscanCount={2}
      >
        {Row}
      </List>
    </div>
  );
}