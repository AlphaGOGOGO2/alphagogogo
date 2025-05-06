
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getClientId, verifyClientId } from "@/utils/clientIdUtils";
import { toast } from "@/components/ui/use-toast";

/**
 * 방문시마다 visit_logs 테이블에 방문 기록을 저장.
 * 클라이언트 ID를 사용하여 고유 방문자 식별
 * RLS 정책에 따라 익명 사용자도 방문 기록 가능
 */
export function useRecordVisit() {
  useEffect(() => {
    async function logVisit() {
      try {
        console.log("방문 기록 시작...");
        
        // 클라이언트 ID 가져오기 (없으면 새로 생성)
        const clientId = getClientId();
        console.log("사용할 클라이언트 ID:", clientId);
        
        if (!clientId || clientId === 'null' || clientId === 'undefined' || clientId.trim() === '') {
          console.error("유효하지 않은 클라이언트 ID:", clientId);
          return;
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // 오늘 이 클라이언트 ID로 이미 방문 기록이 있는지 확인
        console.log("방문 기록 중복 체크 시작...");
        const { data: existingVisits, error: fetchError } = await supabase
          .from("visit_logs")
          .select("id")
          .eq("client_id", clientId)
          .gte("visited_at", today.toISOString())
          .limit(1);
          
        if (fetchError) {
          console.error("방문 기록 조회 실패:", fetchError.message);
          return;
        }
          
        // 조회 결과 로깅
        console.log("중복 방문 체크 결과:", existingVisits?.length > 0 ? "중복 있음" : "중복 없음", existingVisits);
          
        // 오늘 이미 방문 기록이 있으면 중복 기록하지 않음
        if (existingVisits && existingVisits.length > 0) {
          console.log("오늘 이미 방문 기록이 있음:", clientId);
          return;
        }

        // 방문 기록 데이터 구성 (간소화: user-agent와 client_id만 저장)
        const visitData = {
          user_agent: window.navigator.userAgent,
          client_id: clientId,
          // visited_at은 기본값이 now()이므로 명시적으로 설정하지 않음
        };
        
        console.log("저장할 방문 기록 데이터:", visitData);

        // RLS 정책에 따라 익명 사용자도 방문 기록 가능
        const { data: insertResult, error } = await supabase
          .from("visit_logs")
          .insert(visitData)
          .select();
        
        if (error) {
          // 콘솔에만 오류 기록 (사용자 경험에 영향을 주지 않도록)
          console.error("방문 기록 실패:", error.message, error.code, error.details);
        } else {
          console.log("방문 기록 성공:", insertResult);
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
