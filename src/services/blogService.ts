import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogCategory } from "@/types/supabase";
import { BlogPost as UiBlogPost } from "@/types/blog";
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

// Calculate reading time based on word count
// Average reading speed: 200-250 words per minute
const calculateReadingTime = (content: string): number => {
  const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  const words = textContent.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / 200); // Assuming 200 words per minute
  return Math.max(1, readingTime); // Minimum 1 minute
};

// Generate excerpt from content
const generateExcerpt = (content: string, maxLength: number = 150): string => {
  const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  if (textContent.length <= maxLength) {
    return textContent;
  }
  return textContent.substring(0, maxLength).trim() + '...';
};

// Convert Supabase BlogPost to UI BlogPost
export const adaptBlogPost = (post: BlogPost): UiBlogPost => {
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
    readTime: post.read_time,
    coverImage: post.cover_image || "",
    slug: post.slug
  };
};

// Get all blog posts
export const getAllBlogPosts = async (): Promise<UiBlogPost[]> => {
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
export const getBlogPostsByCategory = async (category: string): Promise<UiBlogPost[]> => {
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
export const getBlogPostBySlug = async (slug: string): Promise<UiBlogPost | null> => {
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
  post: Omit<Partial<BlogPost>, "id" | "author_name" | "author_avatar" | "published_at" | "created_at" | "updated_at" | "slug" | "read_time" | "excerpt"> & { tags?: string[] }
): Promise<BlogPost | null> => {
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

    // If tags were provided, we could store them in a related table
    // This would require a separate table for tags and a join table
    // For now, we'll just return the blog post

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

// Extract the first image URL from HTML content
export const extractFirstImageUrl = (htmlContent: string): string | null => {
  const imgRegex = /<img[^>]+src="([^">]+)"/i;
  const match = htmlContent.match(imgRegex);
  return match ? match[1] : null;
};
