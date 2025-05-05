
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BlogPost as SupabaseBlogPost } from "@/types/supabase";

// 안전한 블로그 포스트 생성 - Edge Function 활용
export const secureCreateBlogPost = async (
  post: Omit<Partial<SupabaseBlogPost>, "id" | "author_name" | "author_avatar" | "created_at" | "updated_at" | "slug" | "read_time" | "excerpt"> & { tags?: string[] | string }
): Promise<SupabaseBlogPost | null> => {
  try {
    // 관리자 토큰 확인
    const token = sessionStorage.getItem("blogAuthToken");
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
      toast.error(`블로그 포스트 작성에 실패했습니다: ${error.message || '서버 오류'}`);
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
    toast.error("블로그 포스트 작성에 실패했습니다");
    return null;
  }
};

// 안전한 블로그 포스트 업데이트 - Edge Function 활용
export const secureUpdateBlogPost = async (
  id: string,
  post: Omit<Partial<SupabaseBlogPost>, "id" | "author_name" | "author_avatar" | "created_at" | "updated_at" | "slug" | "read_time" | "excerpt"> & { tags?: string[] | string }
): Promise<SupabaseBlogPost | null> => {
  try {
    // 관리자 토큰 확인
    const token = sessionStorage.getItem("blogAuthToken");
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
      toast.error(`블로그 포스트 수정에 실패했습니다: ${error.message || '서버 오류'}`);
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
    toast.error("블로그 포스트 수정에 실패했습니다");
    return null;
  }
};

// 블로그 서비스에서 기본 export
export const blogSecureService = {
  secureCreateBlogPost,
  secureUpdateBlogPost
};

export default blogSecureService;
