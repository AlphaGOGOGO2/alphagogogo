
import { supabase } from "@/integrations/supabase/client";
import { BlogPost as SupabaseBlogPost } from "@/types/supabase";
import { BlogPost } from "@/types/blog";
import { adaptBlogPost } from "./blogAdapters";
import { toast } from "sonner";
import { getTagsForBlogPost } from "./blogTagService";

// Get all blog posts
export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    // 현재 날짜 가져오기 (1분의 여유 시간 추가)
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1); // 1분 여유 추가
    const nowIsoString = now.toISOString();
    
    console.log(`[블로그] 모든 글 조회 시작, 기준 시간: ${nowIsoString}`);
    
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .lte("published_at", nowIsoString) // 1분 여유를 준 현재 시간보다 이전이거나 같은 경우만
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
    // 현재 날짜 가져오기 (1분의 여유 시간 추가)
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1); // 1분 여유 추가
    const nowIsoString = now.toISOString();
    
    console.log(`[블로그] ${category} 카테고리 글 조회 시작, 기준 시간: ${nowIsoString}`);
    
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("category", category)
      .lte("published_at", nowIsoString) // 1분 여유를 준 현재 시간보다 이전이거나 같은 경우만
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
    
    // 시간 비교를 위해 현재 시간에서 2분의 여유를 줍니다
    const now = new Date();
    now.setMinutes(now.getMinutes() + 2); // 2분 여유 추가 (예약발행 글 접근성 향상)
    const nowIsoString = now.toISOString();
    
    console.log(`[블로그] "${slug}" 슬러그 조회 기준 시간: ${nowIsoString}`);
    
    // 먼저 해당 슬러그의 글이 존재하는지 확인 (시간 제약 없이)
    const { data: postExists, error: checkError } = await supabase
      .from("blog_posts")
      .select("published_at, slug")
      .eq("slug", slug)
      .maybeSingle();
    
    if (checkError) {
      console.error(`[블로그] "${slug}" 슬러그 존재 여부 확인 오류:`, checkError);
      toast.error("블로그 포스트 정보를 확인하는데 실패했습니다");
      return null;
    }
    
    if (!postExists) {
      console.log(`[블로그] "${slug}" 슬러그 글이 존재하지 않음`);
      toast.error("해당 블로그 포스트를 찾을 수 없습니다");
      return null;
    }
    
    // 글이 존재하지만 아직 발행 시간이 되지 않았는지 확인
    const publishedAt = new Date(postExists.published_at);
    if (publishedAt > now) {
      console.log(`[블로그] "${slug}" 슬러그 글은 아직 발행 예정 상태: ${publishedAt.toLocaleString('ko-KR')}`);
      toast.error(`이 포스트는 ${publishedAt.toLocaleString('ko-KR')}에 발행될 예정입니다.`);
      return null;
    }
    
    // 발행된 글 데이터 가져오기
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .lte("published_at", nowIsoString)
      .maybeSingle();

    if (error) {
      console.error(`[블로그] "${slug}" 슬러그 글 데이터 조회 오류:`, error);
      toast.error("블로그 포스트를 불러오는데 실패했습니다");
      return null;
    }

    if (!data) {
      console.log(`[블로그] "${slug}" 슬러그 글 발행 시간 제약 조건에 맞지 않음`);
      return null;
    }

    console.log(`[블로그] "${slug}" 슬러그 글 조회 성공:`, data.title);
    const blogPost = adaptBlogPost(data);
    
    // Fetch tags for this blog post
    try {
      const tags = await getTagsForBlogPost(data.id);
      blogPost.tags = tags.map(tag => tag.name);
      console.log(`[블로그] "${slug}" 슬러그 글 태그 ${tags.length}개 조회 완료`);
    } catch (tagError) {
      console.error(`[블로그] "${slug}" 슬러그 글 태그 조회 오류:`, tagError);
      // We don't want tag failures to prevent post retrieval
    }
    
    return blogPost;
  } catch (error) {
    console.error(`[블로그] "${slug}" 슬러그 글 조회 실패:`, error);
    toast.error("블로그 포스트를 불러오는데 실패했습니다");
    return null;
  }
};

