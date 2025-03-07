
import { supabase } from "@/integrations/supabase/client";
import { BlogPost as SupabaseBlogPost } from "@/types/supabase";
import { BlogPost } from "@/types/blog";
import { adaptBlogPost } from "./blogAdapters";
import { generateSlug, calculateReadingTime, generateExcerpt, extractFirstImageUrl } from "@/utils/blogUtils";
import { toast } from "sonner";

// Get all blog posts
export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map(adaptBlogPost);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    toast.error("블로그 포스트를 불러오는데 실패했습니다");
    return [];
  }
};

// Get blog posts by category
export const getBlogPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("category", category)
      .order("published_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map(adaptBlogPost);
  } catch (error) {
    console.error("Error fetching blog posts by category:", error);
    toast.error("블로그 포스트를 불러오는데 실패했습니다");
    return [];
  }
};

// Get blog post by slug
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      throw error;
    }

    return data ? adaptBlogPost(data) : null;
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    toast.error("블로그 포스트를 불러오는데 실패했습니다");
    return null;
  }
};

// Create a new blog post
export const createBlogPost = async (
  post: Omit<Partial<SupabaseBlogPost>, "id" | "author_name" | "author_avatar" | "published_at" | "created_at" | "updated_at" | "slug" | "read_time" | "excerpt"> & { tags?: string[] }
): Promise<SupabaseBlogPost | null> => {
  try {
    const slug = generateSlug(post.title!);
    const readTime = calculateReadingTime(post.content!);
    const excerpt = generateExcerpt(post.content!);
    
    // Extract first image URL from content if any
    const coverImageUrl = extractFirstImageUrl(post.content!);
    
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        title: post.title!,
        content: post.content!,
        category: post.category!,
        cover_image: coverImageUrl,
        slug,
        read_time: readTime,
        excerpt
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Handle tags if the blog_tags and blog_post_tags tables exist
    if (post.tags && post.tags.length > 0 && data) {
      await handleBlogTags(data.id, post.tags);
    }

    toast.success("블로그 포스트가 성공적으로 작성되었습니다");
    return data;
  } catch (error) {
    console.error("Error creating blog post:", error);
    toast.error("블로그 포스트 작성에 실패했습니다");
    return null;
  }
};

// Handle saving tags for a blog post
async function handleBlogTags(blogPostId: string, tags: string[]): Promise<void> {
  try {
    // Upsert tags first (insert if not exists)
    const { data: tagData, error: tagError } = await supabase
      .from("blog_tags")
      .upsert(
        tags.map(name => ({ name })),
        { onConflict: 'name', ignoreDuplicates: false }
      )
      .select('id, name');

    if (tagError) throw tagError;
    
    // Get all the tag IDs
    const tagMap = new Map(tagData?.map(tag => [tag.name.toLowerCase(), tag.id]));
    
    // Create blog post tag relationships
    const postTagRelations = tags.map(tag => ({
      blog_post_id: blogPostId,
      tag_id: tagMap.get(tag.toLowerCase())
    })).filter(relation => relation.tag_id !== undefined);
    
    if (postTagRelations.length > 0) {
      const { error: relationError } = await supabase
        .from("blog_post_tags")
        .upsert(postTagRelations);
        
      if (relationError) throw relationError;
    }
  } catch (error) {
    console.error("Error handling blog tags:", error);
    // Note: We don't want to fail the post creation if tags fail, so we just log the error
  }
}
