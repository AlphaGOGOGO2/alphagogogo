
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface BlogTag {
  id: string;
  name: string;
}

// Get all blog tags
export const getAllBlogTags = async (): Promise<BlogTag[]> => {
  try {
    const { data, error } = await supabase
      .from("blog_tags")
      .select("id, name")
      .order("name");

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching blog tags:", error);
    toast.error("태그를 불러오는데 실패했습니다");
    return [];
  }
};

// Get tags for a specific blog post
export const getTagsForBlogPost = async (postId: string): Promise<BlogTag[]> => {
  try {
    const { data, error } = await supabase
      .from("blog_post_tags")
      .select(`
        tag_id,
        blog_tags!inner(id, name)
      `)
      .eq("blog_post_id", postId);

    if (error) {
      throw error;
    }

    // Extract the tags from the nested query
    return data ? data.map(item => ({
      id: item.blog_tags.id,
      name: item.blog_tags.name
    })) : [];
  } catch (error) {
    console.error("Error fetching tags for blog post:", error);
    return [];
  }
};

// Get blog posts by tag
export const getBlogPostsByTag = async (tagName: string): Promise<string[]> => {
  try {
    // First find the tag ID
    const { data: tagData, error: tagError } = await supabase
      .from("blog_tags")
      .select("id")
      .eq("name", tagName)
      .single();

    if (tagError || !tagData) {
      return [];
    }

    // Then get all posts with this tag
    const { data, error } = await supabase
      .from("blog_post_tags")
      .select("blog_post_id")
      .eq("tag_id", tagData.id);

    if (error) {
      throw error;
    }

    // Return just the post IDs
    return data ? data.map(item => item.blog_post_id) : [];
  } catch (error) {
    console.error("Error fetching blog posts by tag:", error);
    return [];
  }
};
