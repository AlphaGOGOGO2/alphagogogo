
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getClientId } from "@/utils/clientIdUtils";

/**
 * 방문시마다 record-visit Edge Function을 통해 방문 기록을 안전하게 저장.
 * 클라이언트 ID를 사용하여 고유 방문자 식별
 * Edge Function이 서버측에서 IP 기록과 보안 검증 수행
 */
export function useRecordVisit() {
  useEffect(() => {
    async function logVisit() {
      try {
        // 클라이언트 ID 가져오기 (없으면 새로 생성)
        const clientId = getClientId();
        
        if (!clientId || clientId === 'null' || clientId === 'undefined' || clientId.trim() === '') {
          console.error("유효하지 않은 클라이언트 ID:", clientId);
          return;
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log("[방문자 기록] 클라이언트 ID:", clientId);
        }
        
        // 서버측 Edge Function 호출로 안전한 방문 기록
        const { data, error } = await supabase.functions.invoke('record-visit', {
          body: {
            client_id: clientId,
            user_agent: window.navigator.userAgent,
          },
        });

        if (error) {
          console.error("[방문자 기록] Edge Function 오류:", error);
        } else if (data?.success) {
          if (process.env.NODE_ENV === 'development') {
            console.log("[방문자 기록] 성공");
          }
        } else {
          console.warn("[방문자 기록] 실패:", data?.message);
        }
      } catch (error) {
        // 방문 기록 실패해도 UI에 영향 없게 처리
        console.error("[방문자 기록] - 방문 기록 처리 중 예외 발생:", error);
      }
    }

    // 방문 기록 실행
    logVisit();
  }, []);
}
