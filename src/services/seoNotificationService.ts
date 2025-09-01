import { supabase } from "@/integrations/supabase/client";

// 검색엔진에 사이트맵 업데이트 알림
export const notifySearchEngines = async (): Promise<void> => {
  try {
    console.log('검색엔진 알림 시작...');
    
    // Supabase Edge Function 호출
    const { data, error } = await supabase.functions.invoke('notify-search-engines', {
      body: {
        timestamp: new Date().toISOString(),
        action: 'sitemap_update'
      }
    });

    if (error) {
      console.error('검색엔진 알림 Edge Function 오류:', error);
      return;
    }

    console.log('검색엔진 알림 결과:', data);
  } catch (error) {
    console.error('검색엔진 알림 중 오류 발생:', error);
    // 에러가 발생해도 메인 프로세스를 방해하지 않음
  }
};

// SEO 상태 점검
export const checkSEOStatus = async (): Promise<any> => {
  try {
    console.log('SEO 상태 점검 시작...');
    
    const { data, error } = await supabase.functions.invoke('seo-status-check');
    
    if (error) {
      console.error('SEO 상태 점검 오류:', error);
      return { success: false, error };
    }
    
    console.log('SEO 상태 점검 완료:', data);
    return { success: true, data };
  } catch (error) {
    console.error('SEO 상태 점검 중 오류 발생:', error);
    return { success: false, error };
  }
};

// 블로그 포스트 발행/수정 시 자동 SEO 알림 (개선된 버전)
export const triggerSEOUpdate = async (action: 'create' | 'update', postId: string): Promise<void> => {
  try {
    console.log(`🚀 SEO 업데이트 트리거: ${action} - ${postId}`);
    
    // 즉시 검색엔진에 알림 (비동기로 처리하여 메인 프로세스 블로킹 방지)
    setTimeout(async () => {
      try {
        await notifySearchEngines();
      } catch (error) {
        console.error('검색엔진 알림 실패:', error);
      }
    }, 500);
    
    // SEO 새로고침 트리거 (더 짧은 지연)
    setTimeout(async () => {
      try {
        const { data, error } = await supabase.functions.invoke('scheduled-seo-refresh', {
          body: {
            trigger: 'blog_post_' + action,
            post_id: postId,
            timestamp: new Date().toISOString()
          }
        });
        
        if (error) {
          console.error('예약된 SEO 새로고침 실패:', error);
        } else {
          console.log('✅ 예약된 SEO 새로고침 완료:', data);
        }
      } catch (error) {
        console.error('예약된 SEO 새로고침 오류:', error);
      }
    }, 1500);
    
  } catch (error) {
    console.error('SEO 업데이트 트리거 오류:', error);
  }
};