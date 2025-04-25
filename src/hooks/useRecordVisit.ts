
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * 방문시마다 visit_logs 테이블에 방문 기록을 저장.
 * 중복 방문 허용(동일한 ip/useragent라도 각 새로고침마다 새로 기록)
 * RLS 정책을 고려하여 오류 처리를 개선함
 */
export function useRecordVisit() {
  useEffect(() => {
    // 개발 환경에서는 방문 로깅 건너뛰기
    if (process.env.NODE_ENV === 'development') return;
    
    fetchUserIpAndLog();
    // eslint-disable-next-line
  }, []);

  async function fetchUserIpAndLog() {
    try {
      // 클라이언트의 IP는 서버에서 직접 알 수 없어 외부 API 사용
      let ip = null;
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        if (res.ok) {
          const data = await res.json();
          ip = data.ip;
        }
      } catch (e) {
        // IP 가져오기 실패해도 계속 진행
        console.log("IP 주소 가져오기 실패");
      }

      const userAgent = window.navigator.userAgent;

      // Supabase에 기록 시도
      const { error } = await supabase.from("visit_logs").insert([
        {
          ip_address: ip,
          user_agent: userAgent,
        }
      ]);
      
      // 개발자를 위한 디버그 메시지, 사용자에게는 표시되지 않음
      if (error) {
        console.log("방문 기록 실패 (RLS 정책으로 인한 제한일 수 있음):", error.message);
        
        // 운영 환경에서 중요한 오류만 관리자에게 알림
        if (process.env.NODE_ENV === 'production' && error.code !== '42501') {
          toast.error("방문 기록 중 오류가 발생했습니다.", {
            id: "visit-log-error",
            duration: 3000,
          });
        }
      }
    } catch (e) {
      // 기록 실패해도 UI는 영향 없게 함
      console.log("방문 기록 처리 중 오류:", e);
    }
  }
}
