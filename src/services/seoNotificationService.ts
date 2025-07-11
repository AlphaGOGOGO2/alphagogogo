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

// 블로그 포스트 발행/수정 시 자동 SEO 알림
export const triggerSEOUpdate = async (action: 'create' | 'update', postId: string): Promise<void> => {
  try {
    console.log(`SEO 업데이트 트리거: ${action} - ${postId}`);
    
    // 비동기적으로 검색엔진 알림 (메인 프로세스 블로킹 방지)
    setTimeout(() => {
      notifySearchEngines();
    }, 1000); // 1초 후 실행하여 데이터베이스 커밋 완료 보장
    
    // RSS/사이트맵 캐시 무효화를 위해 Edge Function들에 요청
    setTimeout(async () => {
      try {
        // RSS 피드 갱신
        await fetch('https://plimzlmmftdbpipbnhsy.supabase.co/functions/v1/rss-feed', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
          }
        });
        
        // 사이트맵 갱신
        await fetch('https://plimzlmmftdbpipbnhsy.supabase.co/functions/v1/sitemap', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
          }
        });
        
        console.log('RSS/사이트맵 캐시 갱신 완료');
      } catch (error) {
        console.error('RSS/사이트맵 캐시 갱신 오류:', error);
      }
    }, 2000); // 2초 후 실행
    
  } catch (error) {
    console.error('SEO 업데이트 트리거 오류:', error);
  }
};