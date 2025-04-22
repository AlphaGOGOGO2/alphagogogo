
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * 방문시마다 visit_logs 테이블에 방문 기록을 저장.
 * 중복 방문 허용(동일한 ip/useragent라도 각 새로고침마다 새로 기록)
 */
export function useRecordVisit() {
  useEffect(() => {
    // 이미 기록했다면 중복 기록 방지하고 싶으면 아래 코드 주석 해제
    // if (window.sessionStorage.getItem("visit_logged")) return;
    fetchUserIpAndLog();
    // window.sessionStorage.setItem("visit_logged", "1");
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
        // ignore
      }

      const userAgent = window.navigator.userAgent;

      // Supabase에 기록
      await supabase.from("visit_logs").insert([
        {
          ip_address: ip,
          user_agent: userAgent,
        }
      ]);
    } catch (e) {
      // 기록 실패해도 UI는 영향 없게 함
      // console.log("방문 기록 실패", e);
    }
  }
}
