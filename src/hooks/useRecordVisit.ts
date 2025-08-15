
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
        
        // 오늘 이 클라이언트 ID로 이미 방문 기록이 있는지 확인 대신
        // DB 고유 인덱스(client_id, visit_date) 기반 upsert로 중복 방지
        const visitData = {
          user_agent: window.navigator.userAgent,
          client_id: clientId,
          // visited_at은 DB 기본값 now()
        };

        const { error } = await supabase
          .from("visit_logs")
          .upsert(visitData, {
            onConflict: "client_id,visit_date",
            ignoreDuplicates: true,
          });
        
        if (error) {
          console.error("[방문자 기록] 실패:", error.message);
        } else if (process.env.NODE_ENV === 'development') {
          console.log("[방문자 기록] 성공 (upsert)");
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
