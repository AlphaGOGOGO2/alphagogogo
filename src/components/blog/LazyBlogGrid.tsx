import React, { useEffect, useState, useMemo } from 'react';
import { BlogGrid } from './BlogGrid';
import { VirtualizedBlogGrid } from '@/components/optimization/VirtualizedBlogGrid';
import { BlogPost } from '@/types/blog';
import { measurePerformance } from '@/utils/performanceUtils';
import { bundleAnalyzer } from '@/utils/bundleAnalyzer';

interface LazyBlogGridProps {
  posts: BlogPost[];
  initialBatchSize?: number;
  loadMoreSize?: number;
  enableVirtualization?: boolean;
  virtualItemHeight?: number;
}

export const LazyBlogGrid: React.FC<LazyBlogGridProps> = ({ 
  posts, 
  initialBatchSize = 9, 
  loadMoreSize = 6,
  enableVirtualization = false,
  virtualItemHeight = 400
}) => {
  const [visibleCount, setVisibleCount] = useState(initialBatchSize);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 성능 측정된 포스트 처리
  const processedPosts = useMemo(() => {
    const startTime = performance.now();
    const result = posts;
    bundleAnalyzer.measureChunkLoad('BlogPostProcessing', startTime);
    return result;
  }, [posts]);

  const visiblePosts = useMemo(() => 
    processedPosts.slice(0, visibleCount), 
    [processedPosts, visibleCount]
  );

  const hasMorePosts = visibleCount < processedPosts.length;

  // 더 많은 포스트 로드
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMorePosts) return;
    
    setIsLoadingMore(true);
    // 의도적인 지연으로 UX 향상
    await new Promise(resolve => setTimeout(resolve, 300));
    setVisibleCount(prev => prev + loadMoreSize);
    setIsLoadingMore(false);
  };

  // 무한 스크롤
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        if (hasMorePosts && !isLoadingMore) {
          handleLoadMore();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMorePosts, isLoadingMore]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      // 번들 분석
      bundleAnalyzer.analyzeBundle();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (enableVirtualization && processedPosts.length > 20) {
    return (
      <div className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
        <VirtualizedBlogGrid posts={processedPosts} itemHeight={virtualItemHeight} />
      </div>
    );
  }

  return (
    <div className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
      <BlogGrid posts={visiblePosts} />
      
      {hasMorePosts && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoadingMore ? '로딩 중...' : `더 보기 (${processedPosts.length - visibleCount}개 남음)`}
          </button>
        </div>
      )}
    </div>
  );
};