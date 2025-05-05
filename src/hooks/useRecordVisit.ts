
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
    // 개발 환경에서도 방문 로깅 허용 (이전 코드 수정)
    
    async function logVisit() {
      try {
        // 클라이언트 ID 가져오기
        const clientId = getClientId();
        console.log("현재 클라이언트 ID:", clientId); // 디버깅을 위한 로그 추가
        
        // 클라이언트의 IP는 서버에서 직접 알 수 없어 외부 API 사용
        let ip = null;
        try {
          const res = await fetch("https://api.ipify.org?format=json");
          if (res.ok) {
            const data = await res.json();
            ip = data.ip;
          }
        } catch (error) {
          console.log("IP 주소 가져오기 실패");
        }

        const userAgent = window.navigator.userAgent;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // 오늘 이 클라이언트 ID로 이미 방문 기록이 있는지 확인
        const { data: existingVisits, error: fetchError } = await supabase
          .from("visit_logs")
          .select("id")
          .eq("client_id", clientId)
          .gte("visited_at", today.toISOString())
          .limit(1);
          
        if (fetchError) {
          console.error("방문 기록 조회 실패:", fetchError.message);
        }
          
        // 오늘 이미 방문 기록이 있으면 중복 기록하지 않음
        if (existingVisits && existingVisits.length > 0) {
          console.log("오늘 이미 방문 기록이 있음:", clientId);
          return;
        }

        // RLS 정책에 따라 익명 사용자도 방문 기록 가능
        const { error } = await supabase.from("visit_logs").insert({
          ip_address: ip,
          user_agent: userAgent,
          client_id: clientId,
          // visited_at은 기본값이 now()이므로 명시적으로 설정하지 않아도 됨
        });
        
        if (error) {
          // 콘솔에만 오류 기록 (사용자 경험에 영향을 주지 않도록)
          console.error("방문 기록 실패:", error.message);
        } else {
          console.log("방문 기록 성공:", clientId);
        }
      } catch (error) {
        // 방문 기록 실패해도 UI에 영향 없게 처리
        console.error("방문 기록 처리 중 예외 발생:", error);
      }
    }

    // 방문 기록 실행
    logVisit();
  }, []);
}
