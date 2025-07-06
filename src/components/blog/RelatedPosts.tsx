import { BlogPost } from "@/types/blog";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getRelatedPosts } from "@/utils/relatedPostsUtils";

interface RelatedPostsProps {
  currentPost: BlogPost;
  allPosts: BlogPost[];
  maxCount?: number;
}

export function RelatedPosts({ currentPost, allPosts, maxCount = 3 }: RelatedPostsProps) {
  const relatedPosts = getRelatedPosts(currentPost, allPosts, maxCount);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 pt-8 border-t border-gray-200" aria-labelledby="related-posts-heading">
      <h2 id="related-posts-heading" className="text-2xl font-bold text-gray-900 mb-6">
        관련 글
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <RelatedPostCard key={post.id} post={post} />
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Link
          to={`/blog/${currentPost.category}`}
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors font-medium"
        >
          <span>{currentPost.category} 카테고리의 더 많은 글 보기</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

interface RelatedPostCardProps {
  post: BlogPost;
}

function RelatedPostCard({ post }: RelatedPostCardProps) {
  const postUrl = post.slug ? `/blog/${post.slug}` : `/blog/post/${post.id}`;
  
  return (
    <article className="group">
      <Link
        to={postUrl}
        className="block bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors p-4 h-full"
      >
        {post.coverImage && (
          <div className="mb-3 overflow-hidden rounded-md">
            <img
              src={post.coverImage}
              alt={`${post.title} - ${post.category} 카테고리 블로그 포스트 썸네일`}
              loading="lazy"
              decoding="async"
              className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="mb-2">
          <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
            {post.category}
          </span>
        </div>
        
        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-2 line-clamp-2">
          {post.title}
        </h3>
        
        {post.excerpt && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {post.excerpt}
          </p>
        )}
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index}
                className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 2 && (
              <span className="text-xs text-gray-500">+{post.tags.length - 2}</span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{post.readTime}분</span>
          </div>
        </div>
      </Link>
    </article>
  );
}