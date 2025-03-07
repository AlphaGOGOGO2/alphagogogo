
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogCategory } from "@/types/supabase";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

// Generate a slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim() + "-" + uuidv4().substring(0, 8);
};

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

    return data || [];
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

    return data || [];
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

    return data;
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    toast.error("블로그 포스트를 불러오는데 실패했습니다");
    return null;
  }
};

// Get all blog categories
export const getAllBlogCategories = async (): Promise<BlogCategory[]> => {
  try {
    const { data, error } = await supabase
      .from("blog_categories")
      .select("*")
      .order("name");

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    toast.error("카테고리를 불러오는데 실패했습니다");
    return [];
  }
};

// Create a new blog post
export const createBlogPost = async (
  post: Omit<BlogPost, "id" | "author_name" | "author_avatar" | "published_at" | "created_at" | "updated_at" | "slug">
): Promise<BlogPost | null> => {
  try {
    const slug = generateSlug(post.title);
    
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        ...post,
        slug
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast.success("블로그 포스트가 성공적으로 작성되었습니다");
    return data;
  } catch (error) {
    console.error("Error creating blog post:", error);
    toast.error("블로그 포스트 작성에 실패했습니다");
    return null;
  }
};

// Upload blog image
export const uploadBlogImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    toast.error("이미지 업로드에 실패했습니다");
    return null;
  }
};
