
import { supabase } from "@/integrations/supabase/client";
import { BlogPost as SupabaseBlogPost } from "@/types/supabase";
import { BlogPost } from "@/types/blog";
import { adaptBlogPost } from "./blogAdapters";
import { toast } from "sonner";
import { getTagsForBlogPost } from "./blogTagService";

// Get all blog posts
export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    // 현재 날짜 가져오기
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .lte("published_at", now) // 현재 날짜보다 이전이거나, 같은 시간인 경우만
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
    // 현재 날짜 가져오기
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("category", category)
      .lte("published_at", now) // 현재 날짜보다 이전이거나, 같은 시간인 경우만
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
    // 현재 날짜 가져오기
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .lte("published_at", now) // 현재 날짜보다 이전이거나, 같은 시간인 경우만
      .single();

    if (error) {
      // 찾지 못했거나 아직 발행되지 않은 경우
      console.error("Error fetching blog post by slug:", error);
      
      // 발행 예정인지 확인을 위해 추가 쿼리
      const { data: futurePost } = await supabase
        .from("blog_posts")
        .select("published_at")
        .eq("slug", slug)
        .gt("published_at", now)
        .single();
        
      if (futurePost) {
        // 발행 예정인 포스트인 경우
        const publishDate = new Date(futurePost.published_at);
        toast.error(`이 포스트는 ${publishDate.toLocaleString('ko-KR')}에 발행될 예정입니다.`);
      } else {
        // 존재하지 않는 포스트
        toast.error("해당 블로그 포스트를 찾을 수 없습니다");
      }
      
      return null;
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
