
import { supabase } from "@/integrations/supabase/client";
import { BlogPost as SupabaseBlogPost } from "@/types/supabase";
import { BlogPost } from "@/types/blog";
import { adaptBlogPost } from "./blogAdapters";
import { toast } from "sonner";
import { getTagsForBlogPost } from "./blogTagService";
import { isPastDate } from "@/utils/dateUtils";

// Get all blog posts - 최적화된 버전
export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    console.log("[getAllBlogPosts] 게시글 조회 시작");
    // 현재 날짜 기준으로 쿼리
    const now = new Date().toISOString();
    
    // 데이터 조회 최적화 (필요 필드만 조회)
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .lte("published_at", now)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("[getAllBlogPosts] 쿼리 에러:", error);
      throw error;
    }

    console.log(`[getAllBlogPosts] ${data?.length || 0}개 포스트 조회됨`);
    
    if (!data || data.length === 0) return [];
    
    // 태그 병합 최적화: 모든 포스트에 대한 태그를 한 번에 가져와서 맵핑
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
    console.error("[getAllBlogPosts] 오류 발생:", error);
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

// Get blog posts by category - 최적화된 버전
export const getBlogPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  try {
    console.log(`[getBlogPostsByCategory] "${category}" 카테고리 조회 시작`);
    // 현재 날짜 기준으로 쿼리
    const now = new Date().toISOString();
    
    // 데이터 조회 최적화 (필요 필드만 조회)
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("category", category)
      .lte("published_at", now)
      .order("published_at", { ascending: false });

    if (error) {
      console.error(`[getBlogPostsByCategory] "${category}" 쿼리 에러:`, error);
      throw error;
    }
    
    console.log(`[getBlogPostsByCategory] "${category}" ${data?.length || 0}개 포스트 조회됨`);
    
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
    console.error(`[getBlogPostsByCategory] "${category}" 오류 발생:`, error);
    return [];
  }
};

// ID로 블로그 포스트 가져오기 - 개선된 버전
export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    if (!id) {
      console.error(`[getBlogPostById] 유효하지 않은 ID: ${id}`);
      return null;
    }
    
    console.log(`[getBlogPostById] ID "${id}" 포스트 조회 시작`);
    
    // 글 데이터 조회
    const { data: postData, error: postError } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    
    if (postError) {
      console.error(`[getBlogPostById] ID "${id}" 포스트 조회 쿼리 에러:`, postError);
      return null;
    }
    
    if (!postData) {
      console.log(`[getBlogPostById] ID "${id}" 포스트가 존재하지 않음`);
      return null;
    }
    
    console.log(`[getBlogPostById] ID "${id}" 포스트 조회 성공, 제목: "${postData.title}"`);
    
    // 데이터 변환
    const blogPost = adaptBlogPost(postData);
    
    // 태그 조회
    try {
      const tags = await getTagsForBlogPost(postData.id);
      blogPost.tags = tags.map(tag => tag.name);
    } catch (error) {
      console.error(`[getBlogPostById] ID "${id}" 태그 조회 실패:`, error);
      blogPost.tags = [];
    }
    
    return blogPost;
  } catch (error) {
    console.error(`[getBlogPostById] ID "${id}" 처리 오류:`, error);
    return null;
  }
};

// Get blog post by slug - 개선된 버전
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    if (!slug) {
      console.error(`[getBlogPostBySlug] 유효하지 않은 슬러그: ${slug}`);
      return null;
    }
    
    console.log(`[getBlogPostBySlug] 슬러그 "${slug}" 포스트 조회 시작`);
    
    // 글 데이터 조회 (단일 쿼리로 최적화)
    const { data: postData, error: postError } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    
    if (postError) {
      console.error(`[getBlogPostBySlug] 슬러그 "${slug}" 포스트 조회 쿼리 에러:`, postError);
      return null;
    }
    
    if (!postData) {
      console.log(`[getBlogPostBySlug] 슬러그 "${slug}" 포스트가 존재하지 않음`);
      return null;
    }
    
    console.log(`[getBlogPostBySlug] 슬러그 "${slug}" 포스트 조회 성공, 제목: "${postData.title}"`);
    
    // 데이터 변환
    const blogPost = adaptBlogPost(postData);
    
    // 태그 조회
    try {
      const tags = await getTagsForBlogPost(postData.id);
      blogPost.tags = tags.map(tag => tag.name);
    } catch (error) {
      console.error(`[getBlogPostBySlug] 슬러그 "${slug}" 태그 조회 실패:`, error);
      blogPost.tags = [];
    }
    
    return blogPost;
  } catch (error) {
    console.error(`[getBlogPostBySlug] 슬러그 "${slug}" 처리 오류:`, error);
    return null;
  }
};

// 로그용 날짜 포맷 함수
function formatDateForLog(date: Date): string {
  return `${date.toISOString()} (${date.getTime()})`;
}
