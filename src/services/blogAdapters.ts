
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
    updatedAt: post.updated_at, // Add updatedAt mapping
    readTime: post.read_time,
    coverImage: post.cover_image || "",
    slug: post.slug
  };
};
