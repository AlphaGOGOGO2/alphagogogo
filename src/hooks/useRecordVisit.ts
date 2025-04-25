
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

      // visit_logs 테이블에 RLS 정책을 검토하고 필요시 수정 필요
      // 익명 사용자도 기록할 수 있도록 정책 수정 필요할 수 있음
      try {
        // API 키는 supabase 객체에서 직접 접근할 수 없으므로 헤더 설정을 생략
        // 대신 익명 액세스를 허용하는 RLS 정책을 권장
        const { error } = await supabase.from("visit_logs").insert({
          ip_address: ip,
          user_agent: userAgent,
        });
        
        if (error) {
          console.log("방문 기록 실패:", error.message);
          // 사용자 경험에 영향을 주지 않도록 토스트 메시지는 표시하지 않음
        }
      } catch (error: any) {
        console.error("방문 기록 처리 오류:", error);
      }
    } catch (e) {
      // 방문 기록 실패해도 UI에 영향 없게 처리
      console.error("방문 기록 처리 중 예외 발생:", e);
    }
  }
}
