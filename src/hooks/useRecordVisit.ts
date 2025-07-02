
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getClientId } from "@/utils/clientIdUtils";

/**
 * 방문시마다 visit_logs 테이블에 방문 기록을 저장.
 * 클라이언트 ID를 사용하여 고유 방문자 식별
 * RLS 정책에 따라 익명 사용자도 방문 기록 가능
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
        
        // 오늘 날짜의 시작 시간 (자정)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // 내일 날짜의 시작 시간
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (process.env.NODE_ENV === 'development') {
          console.log("[방문자 기록] 클라이언트 ID:", clientId);
          console.log("[방문자 기록] 오늘 시작:", today.toISOString());
        }
        
        // 오늘 이 클라이언트 ID로 이미 방문 기록이 있는지 확인
        const { data: existingVisits, error: fetchError } = await supabase
          .from("visit_logs")
          .select("id")
          .eq("client_id", clientId)
          .gte("visited_at", today.toISOString())
          .lt("visited_at", tomorrow.toISOString())
          .limit(1);
          
        if (fetchError) {
          console.error("[방문자 기록] - 방문 기록 조회 실패:", fetchError.message);
          return;
        }
          
        // 오늘 이미 방문 기록이 있으면 중복 기록하지 않음
        if (existingVisits && existingVisits.length > 0) {
          return;
        }

        // 방문 기록 데이터 구성
        const visitData = {
          user_agent: window.navigator.userAgent,
          client_id: clientId,
          // IP 주소는 서버에서 자동으로 설정 (브라우저에서 직접 접근 불가)
        };

        // 방문 기록 추가
        const { data: insertResult, error } = await supabase
          .from("visit_logs")
          .insert(visitData)
          .select();
        
        if (error) {
          console.error("[방문자 기록] 실패:", error.message);
        } else if (process.env.NODE_ENV === 'development') {
          console.log("[방문자 기록] 성공");
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
