
import { supabase } from "@/integrations/supabase/client";
import { BlogPost as SupabaseBlogPost } from "@/types/supabase";
import { BlogPost } from "@/types/blog";
import { adaptBlogPost } from "./blogAdapters";
import { toast } from "sonner";
import { getTagsForBlogPost } from "./blogTagService";

// Get all blog posts
export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    // 현재 날짜 가져오기 (5분의 여유 시간 추가)
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5); // 5분 여유 추가
    const nowIsoString = now.toISOString();
    
    console.log(`[블로그] 모든 글 조회 시작, 기준 시간: ${nowIsoString}`);
    console.log(`[블로그] 기준 시간 (가독성): ${now.toLocaleString('ko-KR')}`);
    
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .lte("published_at", nowIsoString) // 5분 여유를 준 현재 시간보다 이전이거나 같은 경우만
      .order("published_at", { ascending: false });

    if (error) {
      console.error("[블로그] 글 조회 오류:", error);
      throw error;
    }

    console.log(`[블로그] 총 ${data?.length || 0}개 글 조회 완료`);
    
    // 시간이 지났지만 타임스탬프가 맞지 않는 경우를 확인
    const adaptedPosts = (data || []).map(post => {
      const pubTime = new Date(post.published_at);
      console.log(`[블로그] 글 "${post.title}" 발행시간: ${pubTime.toLocaleString('ko-KR')}`);
      return adaptBlogPost(post);
    });
    
    return adaptedPosts;
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
    // 현재 날짜 가져오기 (5분의 여유 시간 추가)
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5); // 5분 여유 추가
    const nowIsoString = now.toISOString();
    
    console.log(`[블로그] ${category} 카테고리 글 조회 시작, 기준 시간: ${nowIsoString}`);
    console.log(`[블로그] 기준 시간 (가독성): ${now.toLocaleString('ko-KR')}`);
    
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
    
    // 먼저 글 존재 여부 확인 (시간 제약 없이)
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
    
    // 발행 시간 확인 (시간대 문제를 위한 로직 개선)
    const publishedAt = new Date(postData.published_at);
    const now = new Date();
    
    // 현재 시간에 20분 여유 추가 (충분히 큰 여유로 시간대 문제 해결)
    now.setMinutes(now.getMinutes() + 20);
    
    console.log(`[블로그] "${slug}" 발행 시간: ${publishedAt.toLocaleString('ko-KR')}`);
    console.log(`[블로그] 현재 시간 (+20분): ${now.toLocaleString('ko-KR')}`);
    
    // 발행 시간과 현재 시간 비교
    if (publishedAt > now) {
      const minutesDiff = Math.round((publishedAt.getTime() - now.getTime()) / (1000 * 60));
      const hoursDiff = Math.floor(minutesDiff / 60);
      
      let timeMessage = "";
      if (hoursDiff > 0) {
        timeMessage = `약 ${hoursDiff}시간 ${minutesDiff % 60}분 후`;
      } else {
        timeMessage = `약 ${minutesDiff}분 후`;
      }
      
      console.log(`[블로그] "${slug}" 슬러그 글은 아직 발행 예정 (${timeMessage})`);
      toast.warning(`이 글은 ${publishedAt.toLocaleString('ko-KR')}에 발행될 예정입니다 (${timeMessage})`);
      return null;
    }
    
    // 이미 발행된 글이므로 데이터 반환
    console.log(`[블로그] "${slug}" 슬러그 글 조회 성공 (발행된 글)`);
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
