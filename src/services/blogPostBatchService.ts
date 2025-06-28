
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/types/blog";
import { adaptBlogPost } from "./blogAdapters";

// 배치로 블로그 포스트와 태그를 함께 가져오는 최적화된 서비스
export const getBlogPostsWithTagsBatch = async (postIds: string[]): Promise<Map<string, string[]>> => {
  try {
    if (postIds.length === 0) return new Map();
    
    console.log(`[getBlogPostsWithTagsBatch] ${postIds.length}개 포스트의 태그 배치 조회 시작`);
    
    const { data: tagData, error } = await supabase
      .from("blog_post_tags")
      .select(`
        blog_post_id,
        blog_tags!inner(name)
      `)
      .in("blog_post_id", postIds);
    
    if (error) {
      console.error("[getBlogPostsWithTagsBatch] 태그 배치 조회 오류:", error);
      return new Map();
    }
    
    // 포스트별 태그 맵 생성
    const tagMap = new Map<string, string[]>();
    
    tagData?.forEach(item => {
      const postId = item.blog_post_id;
      const tagName = (item.blog_tags as any)?.name;
      
      if (!tagMap.has(postId)) {
        tagMap.set(postId, []);
      }
      
      if (tagName) {
        tagMap.get(postId)!.push(tagName);
      }
    });
    
    console.log(`[getBlogPostsWithTagsBatch] ${tagMap.size}개 포스트의 태그 배치 조회 완료`);
    return tagMap;
  } catch (error) {
    console.error("[getBlogPostsWithTagsBatch] 배치 조회 실패:", error);
    return new Map();
  }
};

// 최적화된 전체 블로그 포스트 조회
export const getAllBlogPostsOptimized = async (): Promise<BlogPost[]> => {
  try {
    console.log("[getAllBlogPostsOptimized] 최적화된 게시글 조회 시작");
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .lte("published_at", now)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("[getAllBlogPostsOptimized] 쿼리 에러:", error);
      throw error;
    }

    if (!data || data.length === 0) return [];
    
    console.log(`[getAllBlogPostsOptimized] ${data.length}개 포스트 조회됨`);
    
    // 모든 포스트 ID 수집
    const postIds = data.map(post => post.id);
    
    // 배치로 태그 정보 조회
    const tagMap = await getBlogPostsWithTagsBatch(postIds);
    
    // 포스트와 태그 정보 병합
    const postsWithTags = data.map(post => {
      const adaptedPost = adaptBlogPost(post);
      adaptedPost.tags = tagMap.get(post.id) || [];
      return adaptedPost;
    });
    
    console.log("[getAllBlogPostsOptimized] 최적화된 조회 완료");
    return postsWithTags;
  } catch (error) {
    console.error("[getAllBlogPostsOptimized] 오류 발생:", error);
    return [];
  }
};

// 최적화된 카테고리별 블로그 포스트 조회
export const getBlogPostsByCategoryOptimized = async (category: string): Promise<BlogPost[]> => {
  try {
    console.log(`[getBlogPostsByCategoryOptimized] "${category}" 최적화된 조회 시작`);
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("category", category)
      .lte("published_at", now)
      .order("published_at", { ascending: false });

    if (error) {
      console.error(`[getBlogPostsByCategoryOptimized] "${category}" 쿼리 에러:`, error);
      throw error;
    }
    
    if (!data || data.length === 0) return [];
    
    console.log(`[getBlogPostsByCategoryOptimized] "${category}" ${data.length}개 포스트 조회됨`);
    
    // 모든 포스트 ID 수집
    const postIds = data.map(post => post.id);
    
    // 배치로 태그 정보 조회
    const tagMap = await getBlogPostsWithTagsBatch(postIds);
    
    // 포스트와 태그 정보 병합
    const postsWithTags = data.map(post => {
      const adaptedPost = adaptBlogPost(post);
      adaptedPost.tags = tagMap.get(post.id) || [];
      return adaptedPost;
    });
    
    console.log(`[getBlogPostsByCategoryOptimized] "${category}" 최적화된 조회 완료`);
    return postsWithTags;
  } catch (error) {
    console.error(`[getBlogPostsByCategoryOptimized] "${category}" 오류 발생:`, error);
    return [];
  }
};
