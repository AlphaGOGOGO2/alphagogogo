
import { supabase } from "@/integrations/supabase/client";
import { BlogPost as SupabaseBlogPost } from "@/types/supabase";
import { BlogPost } from "@/types/blog";
import { adaptBlogPost } from "./blogAdapters";
import { toast } from "sonner";
import { getTagsForBlogPost } from "./blogTagService";

// Get all blog posts - 간소화 버전
export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    // 현재 날짜 기준으로 쿼리
    const now = new Date().toISOString();
    
    // 데이터 조회 최적화 (필요 필드만 조회)
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .lte("published_at", now)
      .order("published_at", { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) return [];
    
    // 병렬 처리로 태그 조회 최적화
    const postsWithTags = await Promise.all(data.map(async (post) => {
      const adaptedPost = adaptBlogPost(post);
      try {
        const tags = await getTagsForBlogPost(post.id);
        adaptedPost.tags = tags.map(tag => tag.name);
      } catch {
        adaptedPost.tags = [];
      }
      return adaptedPost;
    }));
    
    return postsWithTags;
  } catch (error) {
    console.error("[블로그] 모든 글 조회 실패:", error);
    return [];
  }
};

// 관리자용 - 모든 블로그 포스트 가져오기 (예약발행 포함)
export const getAllBlogPostsForAdmin = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });

    if (error) throw error;

    return (data || []).map(adaptBlogPost);
  } catch (error) {
    console.error("[블로그] 관리자용 글 조회 실패:", error);
    return [];
  }
};

// Get blog posts by category - 간소화 버전
export const getBlogPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  try {
    // 현재 날짜 기준으로 쿼리
    const now = new Date().toISOString();
    
    // 데이터 조회 최적화 (필요 필드만 조회)
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("category", category)
      .lte("published_at", now)
      .order("published_at", { ascending: false });

    if (error) throw error;
    
    if (!data || data.length === 0) return [];
    
    // 병렬 처리로 태그 조회 최적화
    const postsWithTags = await Promise.all(data.map(async (post) => {
      const adaptedPost = adaptBlogPost(post);
      try {
        const tags = await getTagsForBlogPost(post.id);
        adaptedPost.tags = tags.map(tag => tag.name);
      } catch {
        adaptedPost.tags = [];
      }
      return adaptedPost;
    }));
    
    return postsWithTags;
  } catch (error) {
    console.error(`[블로그] ${category} 카테고리 글 조회 실패:`, error);
    return [];
  }
};

// Get blog post by slug - 간소화 버전
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    if (!slug) return null;
    
    // 글 데이터 조회 (단일 쿼리로 최적화)
    const { data: postData, error: postError } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    
    if (postError || !postData) return null;
    
    // 발행 시간 확인
    const publishedAt = new Date(postData.published_at);
    const now = new Date();
    
    // 미래 발행 예정 글이면 null 반환
    if (publishedAt > now) return null;
    
    // 데이터 변환
    const blogPost = adaptBlogPost(postData);
    
    // 태그 조회
    try {
      const tags = await getTagsForBlogPost(postData.id);
      blogPost.tags = tags.map(tag => tag.name);
    } catch {
      blogPost.tags = [];
    }
    
    return blogPost;
  } catch (error) {
    console.error(`[블로그] "${slug}" 슬러그 글 조회 실패:`, error);
    return null;
  }
};
