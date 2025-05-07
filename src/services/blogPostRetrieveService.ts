
import { supabase } from "@/integrations/supabase/client";
import { BlogPost as SupabaseBlogPost } from "@/types/supabase";
import { BlogPost } from "@/types/blog";
import { adaptBlogPost } from "./blogAdapters";
import { toast } from "sonner";
import { getTagsForBlogPost } from "./blogTagService";
import { isFutureDate, formatReadableDate, getTimeUntilPublish } from "@/utils/dateUtils";

// 시간 버퍼 상수 (분 단위) - 성능 최적화를 위해 값 줄임
const TIME_BUFFER_MINUTES = 2;

// Get all blog posts - 성능 최적화
export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    // 현재 날짜 기준으로 버퍼 적용
    const now = new Date();
    const queryTime = new Date(now);
    queryTime.setMinutes(now.getMinutes() + TIME_BUFFER_MINUTES);
    const nowIsoString = queryTime.toISOString();
    
    // 데이터 조회 최적화 (필요 필드만 조회)
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .lte("published_at", nowIsoString)
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
    toast.error("블로그 포스트를 불러오는데 실패했습니다");
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
    toast.error("블로그 포스트를 불러오는데 실패했습니다");
    return [];
  }
};

// Get blog posts by category - 성능 최적화
export const getBlogPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  try {
    // 현재 날짜 기준으로 버퍼 적용 (최적화된 버퍼)
    const now = new Date();
    const queryTime = new Date(now);
    queryTime.setMinutes(now.getMinutes() + TIME_BUFFER_MINUTES);
    const nowIsoString = queryTime.toISOString();
    
    // 데이터 조회 최적화 (필요 필드만 조회)
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("category", category)
      .lte("published_at", nowIsoString)
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
    toast.error("블로그 포스트를 불러오는데 실패했습니다");
    return [];
  }
};

// Get blog post by slug - 성능 최적화
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    if (!slug) {
      toast.error("유효하지 않은 블로그 포스트 주소입니다");
      return null;
    }
    
    // 글 데이터 조회 (단일 쿼리로 최적화)
    const { data: postData, error: postError } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    
    if (postError || !postData) {
      toast.error("블로그 포스트를 찾을 수 없습니다");
      return null;
    }
    
    // 발행 시간이 유효한지 확인 - 빠른 검증
    if (!postData.published_at) {
      toast.error("블로그 포스트 정보가 유효하지 않습니다");
      return null;
    }
    
    // 발행 시간 확인
    const publishedAt = new Date(postData.published_at);
    
    // 예약 발행 글인지 확인 (미래 발행 예정) - 버퍼 0분으로 비교
    if (isFutureDate(publishedAt, 0)) {
      const timeUntil = getTimeUntilPublish(publishedAt);
      toast.warning(`이 글은 ${formatReadableDate(publishedAt)}에 발행될 예정입니다 (${timeUntil})`);
      return null;
    }
    
    // 이미 발행된 글이므로 데이터 변환
    const blogPost = adaptBlogPost(postData);
    
    // 태그 조회 최적화
    try {
      const tags = await getTagsForBlogPost(postData.id);
      blogPost.tags = tags.map(tag => tag.name);
    } catch {
      blogPost.tags = [];
    }
    
    return blogPost;
  } catch (error) {
    console.error(`[블로그] "${slug}" 슬러그 글 조회 실패:`, error);
    toast.error("블로그 포스트를 불러오는데 실패했습니다");
    return null;
  }
};
