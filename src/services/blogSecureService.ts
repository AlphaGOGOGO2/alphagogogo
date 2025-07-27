
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BlogPost as SupabaseBlogPost } from "@/types/supabase";
import { validateBlogPost } from "@/utils/sanitization";

// 안전한 블로그 포스트 생성 - Edge Function 활용
export const secureCreateBlogPost = async (
  post: Omit<Partial<SupabaseBlogPost>, "id" | "author_name" | "author_avatar" | "created_at" | "updated_at" | "slug" | "read_time" | "excerpt"> & { tags?: string[] | string }
): Promise<SupabaseBlogPost | null> => {
  try {
    // 입력 검증 및 정제
    const validation = validateBlogPost(post);
    if (!validation.isValid) {
      toast.error(validation.errors.join(', '));
      return null;
    }

    // 보안 관리자 토큰 확인
    const { getAdminToken } = await import("@/services/secureAuthService");
    const token = getAdminToken();
    if (!token) {
      toast.error("관리자 인증이 필요합니다");
      return null;
    }

    console.log("비밀 포스트 생성 시작, 데이터:", {
      title: post.title,
      category: post.category,
      published_at: post.published_at || new Date().toISOString()
    });
    
    // 태그 처리
    let parsedTags: string[] = [];
    if (post.tags && typeof post.tags === 'string') {
      parsedTags = post.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== "");
    } else if (Array.isArray(post.tags)) {
      parsedTags = post.tags;
    }
    
    // Edge Function 호출
    const { data, error } = await supabase.functions.invoke('manage-blog-post', {
      body: { 
        action: 'create', 
        postData: {
          ...validation.sanitizedData,
          cover_image: post.cover_image,
          published_at: post.published_at,
          tags: parsedTags
        }
      },
      headers: {
        'admin-token': token
      }
    });

    if (error) {
      console.error("Edge Function 호출 오류:", error);
      
      // 오류 유형에 따라 다양한 메시지 표시
      if (error.message && error.message.includes("key value violates unique constraint")) {
        toast.error(`슬러그 생성 오류: 중복된 슬러그가 발생했습니다. 제목을 조금 변경해보세요.`);
      } else if (error.message && error.message.includes("network")) {
        toast.error(`네트워크 오류: 인터넷 연결을 확인해주세요.`);
      } else {
        toast.error(`블로그 포스트 작성에 실패했습니다: ${error.message || '서버 오류'}`);
      }
      
      return null;
    }

    if (!data.success) {
      toast.error(`블로그 포스트 작성에 실패했습니다: ${data.message || '알 수 없는 오류'}`);
      return null;
    }

    console.log("블로그 포스트 생성 성공:", data.data);
    
    // 예약발행 또는 기본 성공 메시지 표시
    if (post.published_at) {
      const isScheduled = new Date(post.published_at) > new Date();
      if (isScheduled) {
        toast.success(`블로그 포스트가 ${new Date(post.published_at).toLocaleString('ko-KR')}에 발행되도록 예약되었습니다`);
      } else {
        toast.success("블로그 포스트가 성공적으로 작성되었습니다");
      }
    } else {
      toast.success("블로그 포스트가 성공적으로 작성되었습니다");
    }
    
    return data.data;
  } catch (error) {
    console.error("블로그 포스트 생성 중 예외 발생:", error);
    
    // 더 세분화된 오류 메시지
    let errorMessage = "블로그 포스트 작성에 실패했습니다";
    if (error.message) {
      if (error.message.includes("duplicate key")) {
        errorMessage += ": 중복된 포스트가 존재합니다";
      } else if (error.message.includes("network")) {
        errorMessage += ": 네트워크 연결을 확인해주세요";
      } else {
        errorMessage += `: ${error.message}`;
      }
    }
    
    toast.error(errorMessage);
    return null;
  }
};

// 안전한 블로그 포스트 업데이트 - Edge Function 활용
export const secureUpdateBlogPost = async (
  id: string,
  post: Omit<Partial<SupabaseBlogPost>, "id" | "author_name" | "author_avatar" | "created_at" | "updated_at" | "slug" | "read_time" | "excerpt"> & { tags?: string[] | string }
): Promise<SupabaseBlogPost | null> => {
  try {
    // 필수 필드 검증
    if (!post.title || !post.content || !post.category) {
      toast.error("제목, 내용, 카테고리는 필수입력 항목입니다");
      return null;
    }
    
    // 보안 관리자 토큰 확인
    const { getAdminToken } = await import("@/services/secureAuthService");
    const token = getAdminToken();
    if (!token) {
      toast.error("관리자 인증이 필요합니다");
      return null;
    }

    console.log("블로그 포스트 업데이트 시작, 데이터:", {
      id,
      title: post.title,
      category: post.category,
      published_at: post.published_at
    });
    
    // 태그 처리
    let parsedTags: string[] = [];
    if (post.tags && typeof post.tags === 'string') {
      parsedTags = post.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== "");
    } else if (Array.isArray(post.tags)) {
      parsedTags = post.tags;
    }
    
    // Edge Function 호출
    const { data, error } = await supabase.functions.invoke('manage-blog-post', {
      body: { 
        action: 'update', 
        postId: id,
        postData: {
          ...post,
          tags: parsedTags
        }
      },
      headers: {
        'admin-token': token
      }
    });

    if (error) {
      console.error("Edge Function 호출 오류:", error);
      
      // 오류 유형에 따라 다양한 메시지 표시
      if (error.message && error.message.includes("network")) {
        toast.error(`네트워크 오류: 인터넷 연결을 확인해주세요.`);
      } else {
        toast.error(`블로그 포스트 수정에 실패했습니다: ${error.message || '서버 오류'}`);
      }
      
      return null;
    }

    if (!data.success) {
      toast.error(`블로그 포스트 수정에 실패했습니다: ${data.message || '알 수 없는 오류'}`);
      return null;
    }

    console.log("블로그 포스트 수정 성공:", data.data);
    
    // 예약발행 또는 기본 성공 메시지 표시
    if (post.published_at) {
      const isScheduled = new Date(post.published_at) > new Date();
      if (isScheduled) {
        toast.success(`블로그 포스트가 ${new Date(post.published_at).toLocaleString('ko-KR')}에 발행되도록 예약되었습니다`);
      } else {
        toast.success("블로그 포스트가 성공적으로 수정되었습니다");
      }
    } else {
      toast.success("블로그 포스트가 성공적으로 수정되었습니다");
    }
    
    return data.data;
  } catch (error) {
    console.error("블로그 포스트 수정 중 예외 발생:", error);
    
    // 더 세분화된 오류 메시지
    let errorMessage = "블로그 포스트 수정에 실패했습니다";
    if (error.message) {
      if (error.message.includes("network")) {
        errorMessage += ": 네트워크 연결을 확인해주세요";
      } else {
        errorMessage += `: ${error.message}`;
      }
    }
    
    toast.error(errorMessage);
    return null;
  }
};

// 블로그 서비스에서 기본 export
export const blogSecureService = {
  secureCreateBlogPost,
  secureUpdateBlogPost
};

export default blogSecureService;
