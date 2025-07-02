
import { BlogPost } from "@/types/blog";
import { Calendar, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { stripMarkdown, extractFirstImageUrl, getCategoryThumbnail } from "@/utils/blogUtils";
import { useNavigate } from "react-router-dom";
import { LazyImage } from "@/components/optimization/LazyImage";

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
  const authorAvatarUrl = "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images/instructor%20profile%20image.png";
  // 제목에서 마크다운 기호 제거
  const displayTitle = extractPlainTitle(post.title ?? "");
  // 마크다운 제거된 excerpt
  const cleanExcerpt = stripMarkdown(post.excerpt ?? "");
  
  // 카드 이미지 설정 - 강화된 우선순위와 폴백 로직
  const extractedImage = post.content ? extractFirstImageUrl(post.content) : null;
  const categoryThumbnail = getCategoryThumbnail(post.category);
  
  // 디버깅을 위한 로그 추가
  console.log(`[BlogCard Debug] 포스트: ${post.title}`);
  console.log(`[BlogCard Debug] post.coverImage: "${post.coverImage}"`);
  console.log(`[BlogCard Debug] (post as any).cover_image: "${(post as any).cover_image}"`);
  console.log(`[BlogCard Debug] extractedImage: "${extractedImage}"`);
  console.log(`[BlogCard Debug] categoryThumbnail: "${categoryThumbnail}"`);
  console.log(`[BlogCard Debug] post 전체:`, post);
  
  // 이미지 우선순위: cover_image → content에서 추출 → 카테고리별 기본
  let cardImage = "";
  // 데이터베이스에서는 cover_image로 저장되므로 이를 확인
  const coverImage = (post as any).cover_image || post.coverImage;
  
  if (coverImage && coverImage.trim() !== '') {
    cardImage = coverImage;
    console.log(`[BlogCard] Cover image 사용: ${coverImage}`);
  } else if (extractedImage) {
    cardImage = extractedImage;
    console.log(`[BlogCard] 추출된 이미지 사용: ${extractedImage}`);
  } else {
    cardImage = categoryThumbnail;
    console.log(`[BlogCard] 카테고리 기본 이미지 사용: ${categoryThumbnail}`);
  }
  

  // 블로그 카드 클릭 핸들러 - 개선된 네비게이션 처리
  const handleCardClick = () => {
    // 디버깅을 위한 로깅
    console.log(`블로그 카드 클릭됨: 제목='${post.title}', ID=${post.id}, slug='${post.slug}'`);
    
    // slug가 있으면 slug로, 없으면 id로 네비게이션
    if (post.slug && post.slug.trim() !== '') {
      navigate(`/blog/${post.slug}`);
      console.log(`slug 기반 URL로 이동: /blog/${post.slug}`);
    } else if (post.id) {
      // slug가 없는 경우 id를 사용
      navigate(`/blog/post/${post.id}`);
      console.log(`포스트 ID로 이동: /blog/post/${post.id} (slug 누락)`);
    } else {
      console.error("블로그 포스트에 slug와 id가 모두 없습니다", post);
      // 기본 블로그 페이지로 리디렉션
      navigate('/blog');
    }
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
        <div className="block overflow-hidden h-48">
          <LazyImage
            src={cardImage}
            alt={displayTitle}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            width={400}
            height={192}
          />
        </div>
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
          <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
            {cleanExcerpt.length > 150 ? `${cleanExcerpt.substring(0, 150)}...` : cleanExcerpt}
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
              <LazyImage
                src={authorAvatarUrl}
                alt={post.author.name}
                className="w-6 h-6 rounded-full mr-2 object-cover"
                width={24}
                height={24}
                loading="lazy"
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
