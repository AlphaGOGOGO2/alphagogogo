
import { supabase } from "@/integrations/supabase/client";
import { BlogPost as SupabaseBlogPost } from "@/types/supabase";
import { generateSlug, calculateReadingTime, generateExcerpt, extractFirstImageUrl } from "@/utils/blogUtils";
import { toast } from "sonner";
import { handleBlogTags } from "./blogPostTagsService";

// Create a new blog post
export const createBlogPost = async (
  post: Omit<Partial<SupabaseBlogPost>, "id" | "author_name" | "author_avatar" | "created_at" | "updated_at" | "slug" | "read_time" | "excerpt"> & { tags?: string[] }
): Promise<SupabaseBlogPost | null> => {
  try {
    const slug = generateSlug(post.title!);
    const readTime = calculateReadingTime(post.content!);
    const excerpt = generateExcerpt(post.content!);
    
    // Extract first image URL from content if any
    const coverImageUrl = extractFirstImageUrl(post.content!);
    
    console.log("Preparing to insert blog post with data:", {
      title: post.title,
      category: post.category,
      slug,
      read_time: readTime,
      excerpt,
      coverImageUrl
    });
    
    // Use post.published_at if it exists; otherwise, use now
    const blogPostData = {
      title: post.title!,
      content: post.content!,
      category: post.category!,
      cover_image: coverImageUrl,
      slug,
      read_time: readTime,
      excerpt,
      author_name: "알파GOGOGO", // Default author name
      author_avatar: "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//instructor%20profile%20image.png", // Updated profile image URL
      published_at: post.published_at ?? new Date().toISOString()
    };
    
    console.log("Final blog post data for insert:", blogPostData);
    
    const { data, error } = await supabase
      .from("blog_posts")
      .insert(blogPostData)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      
      // Handle specific error cases
      if (error.code === '42501') {
        // Permission denied error
        console.error("Permission denied error. RLS policy might be blocking the operation.");
        toast.error("권한 오류: 블로그 포스트 작성 권한이 없습니다");
        return null;
      }
      
      throw error;
    }

    console.log("Blog post inserted successfully:", data);

    // Handle tags if the blog_tags and blog_post_tags tables exist
    if (post.tags && post.tags.length > 0 && data) {
      try {
        await handleBlogTags(data.id, post.tags);
      } catch (tagError) {
        // We don't want tag errors to prevent post creation
        console.error("Error handling tags, but post was created:", tagError);
      }
    }

    toast.success("블로그 포스트가 성공적으로 작성되었습니다");
    return data;
  } catch (error) {
    console.error("Error creating blog post:", error);
    
    // Provide more specific error messages based on the error type
    if (error.message && error.message.includes("violates row-level security policy")) {
      toast.error("권한 오류: 데이터베이스 정책에 의해 저장이 거부되었습니다");
    } else {
      toast.error("블로그 포스트 작성에 실패했습니다");
    }
    
    return null;
  }
};
