
import { supabase } from "@/integrations/supabase/client";
import { BlogPost as SupabaseBlogPost } from "@/types/supabase";
import { BlogPost } from "@/types/blog";
import { adaptBlogPost } from "./blogAdapters";
import { toast } from "sonner";
import { getTagsForBlogPost } from "./blogTagService";
import { isFutureDate, formatReadableDate, getTimeUntilPublish } from "@/utils/dateUtils";

// 시간 버퍼 상수 (분 단위)
const TIME_BUFFER_MINUTES = 5;

// Get all blog posts
export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    // 현재 날짜 기준으로 버퍼 적용
    const now = new Date();
    now.setMinutes(now.getMinutes() + TIME_BUFFER_MINUTES);
    const nowIsoString = now.toISOString();
    
    console.log(`[블로그] 모든 글 조회 시작, 기준 시간: ${formatReadableDate(now)}`);
    
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .lte("published_at", nowIsoString)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("[블로그] 글 조회 오류:", error);
      throw error;
    }

    console.log(`[블로그] 총 ${data?.length || 0}개 글 조회 완료`);
    return (data || []).map(adaptBlogPost);
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

    if (error) {
      throw error;
    }

    return (data || []).map(adaptBlogPost);
  } catch (error) {
    console.error("[블로그] 관리자용 글 조회 실패:", error);
    toast.error("블로그 포스트를 불러오는데 실패했습니다");
    return [];
  }
};

// Get blog posts by category
export const getBlogPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  try {
    // 현재 날짜 기준으로 버퍼 적용
    const now = new Date();
    now.setMinutes(now.getMinutes() + TIME_BUFFER_MINUTES);
    const nowIsoString = now.toISOString();
    
    console.log(`[블로그] ${category} 카테고리 글 조회 시작, 기준 시간: ${formatReadableDate(now)}`);
    
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("category", category)
      .lte("published_at", nowIsoString)
      .order("published_at", { ascending: false });

    if (error) {
      console.error(`[블로그] ${category} 카테고리 글 조회 오류:`, error);
      throw error;
    }

    console.log(`[블로그] ${category} 카테고리 총 ${data?.length || 0}개 글 조회 완료`);
    return (data || []).map(adaptBlogPost);
  } catch (error) {
    console.error(`[블로그] ${category} 카테고리 글 조회 실패:`, error);
    toast.error("블로그 포스트를 불러오는데 실패했습니다");
    return [];
  }
};

// Get blog post by slug
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    console.log(`[블로그] "${slug}" 슬러그 글 조회 시작`);
    
    // 글 데이터 조회
    const { data: postData, error: postError } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    
    if (postError) {
      console.error(`[블로그] "${slug}" 슬러그 조회 오류:`, postError);
      toast.error("블로그 포스트를 불러오는데 실패했습니다");
      return null;
    }
    
    // 글이 존재하지 않는 경우
    if (!postData) {
      console.log(`[블로그] "${slug}" 슬러그 글이 존재하지 않음`);
      toast.error("해당 블로그 포스트를 찾을 수 없습니다");
      return null;
    }
    
    console.log(`[블로그] "${slug}" 슬러그 글 발견: "${postData.title}"`);
    
    // 발행 시간 확인
    const publishedAt = new Date(postData.published_at);
    
    // 예약 발행 글인지 확인 (미래 발행 예정)
    if (isFutureDate(publishedAt, TIME_BUFFER_MINUTES)) {
      const timeUntil = getTimeUntilPublish(publishedAt);
      console.log(`[블로그] "${slug}" 슬러그 글은 아직 발행 예정 (${timeUntil})`);
      toast.warning(`이 글은 ${formatReadableDate(publishedAt)}에 발행될 예정입니다 (${timeUntil})`);
      return null;
    }
    
    // 이미 발행된 글이므로 데이터 변환
    const blogPost = adaptBlogPost(postData);
    
    // 태그 조회
    try {
      const tags = await getTagsForBlogPost(postData.id);
      blogPost.tags = tags.map(tag => tag.name);
      console.log(`[블로그] "${slug}" 슬러그 글 태그 ${tags.length}개 조회 완료`);
    } catch (tagError) {
      console.error(`[블로그] "${slug}" 슬러그 글 태그 조회 오류:`, tagError);
      blogPost.tags = [];
    }
    
    return blogPost;
  } catch (error) {
    console.error(`[블로그] "${slug}" 슬러그 글 조회 실패:`, error);
    toast.error("블로그 포스트를 불러오는데 실패했습니다");
    return null;
  }
};
