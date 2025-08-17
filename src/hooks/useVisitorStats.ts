import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { getAdminToken } from "@/services/secureAuthService";

interface VisitStat {
  date: string;
  count: number;
}

interface VisitorStatsResult {
  todayVisitCount: number | null;
  monthlyVisitCount: number | null;
  monthlyVisitStats: VisitStat[];
  isLoadingTodayVisits: boolean;
  isLoadingMonthlyVisits: boolean;
  refreshStats: () => Promise<void>;
}

export function useVisitorStats(): VisitorStatsResult {
  const [todayVisitCount, setTodayVisitCount] = useState<number | null>(null);
  const [monthlyVisitCount, setMonthlyVisitCount] = useState<number | null>(null);
  const [isLoadingTodayVisits, setIsLoadingTodayVisits] = useState(true);
  const [isLoadingMonthlyVisits, setIsLoadingMonthlyVisits] = useState(true);
  const [monthlyVisitStats, setMonthlyVisitStats] = useState<VisitStat[]>([]);

  const fetchViaEdge = async () => {
    try {
      setIsLoadingTodayVisits(true);
      setIsLoadingMonthlyVisits(true);

      const token = await getAdminToken();
      if (!token) {
        throw new Error("관리자 인증 토큰이 없습니다. 다시 로그인 해주세요.");
      }

      const res = await fetch(
        "https://plimzlmmftdbpipbnhsy.supabase.co/functions/v1/get-visitor-stats",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "admin-token": token as string,
          },
        }
      );

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "방문자 통계 조회 실패");
      }

      setTodayVisitCount(json.data.todayVisitCount ?? 0);
      setMonthlyVisitCount(json.data.monthlyVisitCount ?? 0);
      setMonthlyVisitStats(json.data.monthlyVisitStats ?? []);
    } catch (error) {
      console.error("[방문자 통계] 조회 오류:", error);
      toast({
        title: "오류",
        description: "방문자 통계를 불러오는 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTodayVisits(false);
      setIsLoadingMonthlyVisits(false);
    }
  };

  // 방문자 통계 새로고침 함수
  const refreshStats = async () => {
    await fetchViaEdge();
  };

  useEffect(() => {
    fetchViaEdge();
  }, []);

  return {
    todayVisitCount,
    monthlyVisitCount,
    monthlyVisitStats,
    isLoadingTodayVisits,
    isLoadingMonthlyVisits,
    refreshStats,
  };
}
