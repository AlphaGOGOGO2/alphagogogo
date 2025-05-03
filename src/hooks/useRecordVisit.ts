
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * 방문시마다 visit_logs 테이블에 방문 기록을 저장.
 * 중복 방문 허용(동일한 ip/useragent라도 각 새로고침마다 새로 기록)
 * RLS 정책에 따라 익명 사용자도 방문 기록 가능
 */
export function useRecordVisit() {
  useEffect(() => {
    // 개발 환경에서는 방문 로깅 건너뛰기
    if (process.env.NODE_ENV === 'development') return;
    
    async function logVisit() {
      try {
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

        // RLS 정책에 따라 익명 사용자도 방문 기록 가능
        const { error } = await supabase.from("visit_logs").insert({
          ip_address: ip,
          user_agent: userAgent,
          // visited_at은 기본값이 now()이므로 명시적으로 설정하지 않아도 됨
        });
        
        if (error) {
          // 콘솔에만 오류 기록 (사용자 경험에 영향을 주지 않도록)
          console.error("방문 기록 실패:", error.message);
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
