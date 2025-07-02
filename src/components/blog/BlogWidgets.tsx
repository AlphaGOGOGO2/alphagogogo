import { BlogPost } from "@/types/blog";
import { Link } from "react-router-dom";
import { ExternalLink, Tag, TrendingUp } from "lucide-react";

interface TagCloudProps {
  posts: BlogPost[];
  maxTags?: number;
  className?: string;
}

export function TagCloud({ posts, maxTags = 20, className = "" }: TagCloudProps) {
  // 모든 태그 수집 및 빈도 계산
  const tagFrequency = new Map<string, number>();
  
  posts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => {
        const normalizedTag = tag.toLowerCase().trim();
        tagFrequency.set(normalizedTag, (tagFrequency.get(normalizedTag) || 0) + 1);
      });
    }
  });

  // 빈도순으로 정렬하고 상위 태그만 선택
  const sortedTags = Array.from(tagFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxTags);

  if (sortedTags.length === 0) {
    return null;
  }

  // 최대 빈도와 최소 빈도 계산 (폰트 크기 조절용)
  const maxFreq = Math.max(...sortedTags.map(([, freq]) => freq));
  const minFreq = Math.min(...sortedTags.map(([, freq]) => freq));

  // 폰트 크기 계산 함수
  const getFontSize = (frequency: number): string => {
    if (maxFreq === minFreq) return "text-sm";
    
    const ratio = (frequency - minFreq) / (maxFreq - minFreq);
    
    if (ratio >= 0.8) return "text-lg font-semibold";
    if (ratio >= 0.6) return "text-base font-medium";
    if (ratio >= 0.4) return "text-sm font-medium";
    return "text-sm";
  };

  // 색상 클래스 계산 함수
  const getColorClass = (frequency: number): string => {
    if (maxFreq === minFreq) return "text-purple-600 hover:text-purple-800";
    
    const ratio = (frequency - minFreq) / (maxFreq - minFreq);
    
    if (ratio >= 0.8) return "text-purple-800 hover:text-purple-900";
    if (ratio >= 0.6) return "text-purple-700 hover:text-purple-800";
    if (ratio >= 0.4) return "text-purple-600 hover:text-purple-700";
    return "text-purple-500 hover:text-purple-600";
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Tag className="text-purple-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-900">인기 태그</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {sortedTags.map(([tag, frequency]) => (
          <Link
            key={tag}
            to={`/blog?tag=${encodeURIComponent(tag)}`}
            className={`
              inline-flex items-center gap-1 px-3 py-1.5 rounded-full 
              bg-purple-50 hover:bg-purple-100 border border-purple-200 
              transition-all duration-200 hover:scale-105
              ${getFontSize(frequency)} ${getColorClass(frequency)}
            `}
            title={`${frequency}개의 포스트`}
          >
            <span>#{tag}</span>
            <span className="text-xs opacity-75">({frequency})</span>
          </Link>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 transition-colors"
        >
          <span>모든 태그 보기</span>
          <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
}

// 카테고리별 인기 포스트 위젯
interface PopularPostsWidgetProps {
  posts: BlogPost[];
  maxPosts?: number;
  className?: string;
}

export function PopularPostsWidget({ posts, maxPosts = 5, className = "" }: PopularPostsWidgetProps) {
  // 최신 포스트 중에서 선별 (실제로는 조회수나 좋아요 수 기준으로 정렬 가능)
  const popularPosts = posts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, maxPosts);

  if (popularPosts.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-orange-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-900">인기 글</h3>
      </div>
      
      <div className="space-y-3">
        {popularPosts.map((post, index) => (
          <Link
            key={post.id}
            to={post.slug ? `/blog/${post.slug}` : `/blog/post/${post.id}`}
            className="block group"
          >
            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span className="px-1.5 py-0.5 bg-gray-100 rounded">
                    {post.category}
                  </span>
                  <span>{post.readTime}분</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}