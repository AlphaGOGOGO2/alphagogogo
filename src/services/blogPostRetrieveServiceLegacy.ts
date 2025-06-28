
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/types/blog";
import { adaptBlogPost } from "./blogAdapters";
import { getTagsForBlogPost } from "./blogTagService";

// 레거시 개별 조회 함수들 - 호환성 유지용
export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    if (!id) {
      console.error(`[getBlogPostById] 유효하지 않은 ID: ${id}`);
      return null;
    }
    
    console.log(`[getBlogPostById] ID "${id}" 포스트 조회 시작`);
    
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
    
    const blogPost = adaptBlogPost(postData);
    
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

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    if (!slug) {
      console.error(`[getBlogPostBySlug] 유효하지 않은 슬러그: ${slug}`);
      return null;
    }
    
    console.log(`[getBlogPostBySlug] 슬러그 "${slug}" 포스트 조회 시작`);
    
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
    
    const blogPost = adaptBlogPost(postData);
    
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
