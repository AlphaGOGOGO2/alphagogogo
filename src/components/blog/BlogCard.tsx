
import { BlogPost } from "@/types/blog";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { stripMarkdown, extractFirstImageUrl } from "@/utils/blogUtils";
import { toast } from "sonner";
import { isFutureDate, formatReadableDate, getTimeUntilPublish } from "@/utils/dateUtils";

// 마크다운 #, ## 같은 제목 앞 기호 제거 함수
function extractPlainTitle(markdownTitle: string): string {
  // "# 제목" 또는 "## 제목" 같은 마크다운 제목 포맷 제거
  return markdownTitle.replace(/^\s*#+\s*/, '').trim();
}

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const navigate = useNavigate();
  
  // 저장된 프로필 이미지 URL 사용
  const authorAvatarUrl = "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//instructor%20profile%20image.png";
  // 제목에서 마크다운 기호 제거
  const displayTitle = extractPlainTitle(post.title ?? "");
  // 마크다운 제거된 excerpt
  const cleanExcerpt = stripMarkdown(post.excerpt ?? "");
  
  // 카드 이미지 설정 (커버 이미지 또는 본문에서 추출)
  const cardImage = post.coverImage || (post.content && extractFirstImageUrl(post.content));

  // 블로그 카드 클릭 핸들러 - React Router 네비게이션 사용
  const handleCardClick = () => {
    const publishDate = new Date(post.publishedAt);
    const isScheduledPost = isFutureDate(publishDate);
    
    if (isScheduledPost) {
      // 예약 발행 글인 경우 토스트 메시지로 안내
      const timeUntil = getTimeUntilPublish(publishDate);
      toast.info(`"${displayTitle}" 글은 ${formatReadableDate(publishDate)}에 발행될 예정입니다 (${timeUntil})`, {
        duration: 3000
      });
      return;
    }

    // 일반 발행 글인 경우 네비게이션
    toast.success(`"${displayTitle}" 글로 이동합니다...`, {
      duration: 2000,
    });
    
    // 중요: setTimeout으로 토스트 메시지가 보이도록 약간의 지연 후 이동
    setTimeout(() => {
      navigate(`/blog/${post.slug}`);
    }, 300);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="block h-full cursor-pointer"
      role="button"
      aria-label={`블로그 포스트 읽기: ${displayTitle}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <article className="rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col hover:-translate-y-1 transition-transform border-2 border-purple-300 hover:border-purple-500">
        {cardImage && (
          <div className="block overflow-hidden h-48">
            <img 
              src={cardImage} 
              alt={displayTitle} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-5 flex-grow flex flex-col">
          <div className="mb-3">
            <span className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
              {post.category}
            </span>
          </div>
          <div className="block mb-2">
            <h3 className="text-lg font-bold text-gray-800 hover:text-purple-700 transition-colors duration-200">
              {displayTitle}
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-4 flex-grow">
            {cleanExcerpt}
          </p>
          {/* 태그가 있을 경우 표시 */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index} 
                  className="px-2 py-0.5 bg-purple-50 text-purple-600 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{post.tags.length - 3}</span>
              )}
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
            <div className="flex items-center">
              <img 
                src={authorAvatarUrl} 
                alt={post.author.name} 
                className="w-6 h-6 rounded-full mr-2 object-cover" 
              />
              <span>{post.author.name}</span>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center">
                <Calendar size={14} className="mr-1 text-purple-500" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center">
                <Clock size={14} className="mr-1 text-purple-500" />
                <span>{post.readTime}분</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
