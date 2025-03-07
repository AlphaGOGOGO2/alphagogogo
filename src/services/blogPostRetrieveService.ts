
import { supabase } from "@/integrations/supabase/client";
import { BlogPost as SupabaseBlogPost } from "@/types/supabase";
import { BlogPost } from "@/types/blog";
import { adaptBlogPost } from "./blogAdapters";
import { toast } from "sonner";
import { getTagsForBlogPost } from "./blogTagService";

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

    if (!data) return null;

    const blogPost = adaptBlogPost(data);
    
    // Fetch tags for this blog post
    try {
      const tags = await getTagsForBlogPost(data.id);
      blogPost.tags = tags.map(tag => tag.name);
    } catch (tagError) {
      console.error("Error fetching tags for blog post:", tagError);
      // We don't want tag failures to prevent post retrieval
    }
    
    return blogPost;
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    toast.error("블로그 포스트를 불러오는데 실패했습니다");
    return null;
  }
};
