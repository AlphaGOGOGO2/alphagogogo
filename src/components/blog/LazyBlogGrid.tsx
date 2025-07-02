import { BlogPost } from "@/types/blog";
import { useState, useEffect, useMemo } from "react";
import { BlogCard } from "./BlogCard";

interface LazyBlogGridProps {
  posts: BlogPost[];
  initialBatchSize?: number;
  loadMoreSize?: number;
}

export function LazyBlogGrid({ 
  posts, 
  initialBatchSize = 6, 
  loadMoreSize = 6 
}: LazyBlogGridProps) {
  const [visibleCount, setVisibleCount] = useState(initialBatchSize);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 표시할 포스트 계산 (메모이제이션)
  const visiblePosts = useMemo(() => 
    posts.slice(0, visibleCount), 
    [posts, visibleCount]
  );

  const hasMorePosts = visibleCount < posts.length;

  // 더 보기 핸들러
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMorePosts) return;
    
    setIsLoadingMore(true);
    
    // 시뮬레이션된 로딩 지연 (실제로는 필요 없음)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setVisibleCount(prev => Math.min(prev + loadMoreSize, posts.length));
    setIsLoadingMore(false);
  };

  // 무한 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop 
        >= document.documentElement.offsetHeight - 1000 // 1000px 전에 로드
        && hasMorePosts 
        && !isLoadingMore
      ) {
        handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMorePosts, isLoadingMore]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visiblePosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      
      {hasMorePosts && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="더 많은 포스트 로드하기"
          >
            {isLoadingMore ? '로딩 중...' : `더보기 (${posts.length - visibleCount}개 남음)`}
          </button>
        </div>
      )}
    </>
  );
}