
import { BlogPost as SupabaseBlogPost, BlogCategory } from "@/types/supabase";
import { BlogPost } from "@/types/blog";

// Convert Supabase BlogPost to UI BlogPost
export const adaptBlogPost = (post: SupabaseBlogPost): BlogPost => {
  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || "",
    content: post.content,
    category: post.category,
    author: {
      name: post.author_name,
      avatar: post.author_avatar
    },
    publishedAt: post.published_at,
    updatedAt: post.updated_at,
    readTime: post.read_time,
    // cover_image가 null이거나 빈 문자열이면 undefined로 처리하여 BlogCard에서 폴백 로직이 작동하도록 함
    coverImage: post.cover_image && post.cover_image.trim() !== '' ? post.cover_image : undefined,
    slug: post.slug
  };
};
