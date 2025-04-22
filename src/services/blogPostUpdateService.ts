import { supabase } from "@/integrations/supabase/client";
import { BlogPost as SupabaseBlogPost } from "@/types/supabase";
import { calculateReadingTime, generateExcerpt, extractFirstImageUrl } from "@/utils/blogUtils";
import { toast } from "sonner";
import { handleBlogTags, removeExistingTags } from "./blogPostTagsService";

// Update an existing blog post
export const updateBlogPost = async (
  id: string,
  post: Omit<Partial<SupabaseBlogPost>, "id" | "author_name" | "author_avatar" | "created_at" | "updated_at" | "slug" | "read_time" | "excerpt"> & { tags?: string[] }
): Promise<SupabaseBlogPost | null> => {
  try {
    const readTime = calculateReadingTime(post.content!);
    const excerpt = generateExcerpt(post.content!);
    
    // Extract first image URL from content if any
    const coverImageUrl = extractFirstImageUrl(post.content!);
    
    console.log("Preparing to update blog post with data:", {
      id,
      title: post.title,
      category: post.category,
      read_time: readTime,
      excerpt,
      coverImageUrl
    });
    
    // Use post.published_at if given, otherwise leave unchanged
    const blogPostData: Partial<SupabaseBlogPost> = {
      title: post.title!,
      content: post.content!,
      category: post.category!,
      cover_image: coverImageUrl,
      read_time: readTime,
      excerpt,
      updated_at: new Date().toISOString()
    };
    if (post.published_at) {
      blogPostData.published_at = post.published_at;
    }
    
    console.log("Final blog post data for update:", blogPostData);
    
    const { data, error } = await supabase
      .from("blog_posts")
      .update(blogPostData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      throw error;
    }

    console.log("Blog post updated successfully:", data);

    // Handle tags if the blog_tags and blog_post_tags tables exist
    if (post.tags && post.tags.length > 0 && data) {
      try {
        // First remove existing tag associations
        await removeExistingTags(data.id);
        // Then add the new ones
        await handleBlogTags(data.id, post.tags);
      } catch (tagError) {
        // We don't want tag errors to prevent post update
        console.error("Error handling tags, but post was updated:", tagError);
      }
    }

    toast.success("블로그 포스트가 성공적으로 수정되었습니다");
    return data;
  } catch (error) {
    console.error("Error updating blog post:", error);
    toast.error("블로그 포스트 수정에 실패했습니다");
    return null;
  }
};
