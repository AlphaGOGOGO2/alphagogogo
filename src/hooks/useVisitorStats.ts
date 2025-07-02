
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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

  // 방문자 통계 새로고침 함수
  const refreshStats = async () => {
    try {
      await Promise.all([
        fetchTodayVisitCount(),
        fetchMonthlyVisitCount()
      ]);
    } catch (error) {
      console.error("방문자 통계 새로고침 오류:", error);
      toast({
        title: "오류",
        description: "방문자 통계를 불러오는 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    refreshStats();
  }, []);

  // 오늘 방문자 수만 조회하는 함수
  const fetchTodayVisitCount = async () => {
    try {
      setIsLoadingTodayVisits(true);
      
      // 현재 날짜와 시간
      const now = new Date();
      
      // 오늘 자정 (시작 시간)
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // 내일 자정 (종료 시간)
      const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      
      if (process.env.NODE_ENV === 'development') {
        console.log("[오늘 방문자 조회] 시작:", todayStart.toISOString());
      }
      
      // 오늘 방문자 데이터 쿼리 - 오늘 하루 데이터만 조회
      const { data: todayVisits, error: todayError } = await supabase
        .from("visit_logs")
        .select("client_id, visited_at")
        .gte("visited_at", todayStart.toISOString())
        .lt("visited_at", tomorrowStart.toISOString());
      
      if (todayError) {
        console.error("[오늘 방문자 조회] 오류:", todayError);
        setTodayVisitCount(0);
        return;
      }
      
      // 오늘의 고유 방문자 ID 계산
      const uniqueTodayVisitors = new Set<string>();
      
      if (todayVisits) {
        if (process.env.NODE_ENV === 'development') {
          console.log("[오늘 방문자 조회] 데이터 수:", todayVisits.length);
        }
        
        todayVisits.forEach(visit => {
          if (visit.client_id && 
              visit.client_id !== 'null' && 
              visit.client_id !== 'undefined' && 
              visit.client_id.trim() !== '') {
            uniqueTodayVisitors.add(visit.client_id);
          }
        });
      }
      
      const todayCount = uniqueTodayVisitors.size;
      if (process.env.NODE_ENV === 'development') {
        console.log("[오늘 방문자 조회] 계산된 방문자 수:", todayCount);
      }
      setTodayVisitCount(todayCount);
    } catch (error) {
      console.error("[오늘 방문자 조회] 처리 오류:", error);
      setTodayVisitCount(0);
    } finally {
      setIsLoadingTodayVisits(false);
    }
  };
  
  // 이번 달 방문자 수 및 통계 조회하는 함수
  const fetchMonthlyVisitCount = async () => {
    try {
      setIsLoadingMonthlyVisits(true);
      
      // 현재 날짜와 시간
      const now = new Date();
      
      // 이번 달 시작 날짜
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      // 다음 달 시작 날짜 (이번 달의 종료 시간)
      const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      
      console.log("[이달 방문자 조회] 조회 시작 시간:", monthStart.toISOString());
      console.log("[이달 방문자 조회] 조회 종료 시간:", nextMonthStart.toISOString());
      
      // 이번 달 방문자 데이터 쿼리 - 이번 달 전체 데이터 조회
      const { data: monthVisits, error: monthError } = await supabase
        .from("visit_logs")
        .select("client_id, visited_at")
        .gte("visited_at", monthStart.toISOString())
        .lt("visited_at", nextMonthStart.toISOString());
      
      if (monthError) {
        console.error("[이달 방문자 조회] 오류:", monthError);
        setMonthlyVisitCount(0);
        setMonthlyVisitStats([]);
        return;
      }
      
      // 이번 달 전체 고유 방문자 계산
      const uniqueMonthlyVisitors = new Set<string>();
      const dailyStats = new Map<string, Set<string>>();
      
      if (monthVisits) {
        console.log("[이달 방문자 조회] 방문 기록 데이터 수:", monthVisits.length);
        
        monthVisits.forEach(visit => {
          if (visit.client_id && 
              visit.client_id !== 'null' && 
              visit.client_id !== 'undefined' && 
              visit.client_id.trim() !== '') {
            
            // 월별 고유 방문자 추가
            uniqueMonthlyVisitors.add(visit.client_id);
            
            // 일별 방문자 통계 계산
            const visitDate = new Date(visit.visited_at).toISOString().split('T')[0];
            if (!dailyStats.has(visitDate)) {
              dailyStats.set(visitDate, new Set<string>());
            }
            dailyStats.get(visitDate)?.add(visit.client_id);
          }
        });
      }
      
      const monthlyCount = uniqueMonthlyVisitors.size;
      console.log("[이달 방문자 조회] 계산된 방문자 수:", monthlyCount);
      setMonthlyVisitCount(monthlyCount);
      
      // 일별 방문자 통계 정렬 및 설정
      const visitStats = Array.from(dailyStats.entries())
        .map(([date, visitors]) => ({
          date: date,
          count: visitors.size
        }))
        .sort((a, b) => b.date.localeCompare(a.date)); // 최신 날짜가 먼저 오도록 정렬
      
      setMonthlyVisitStats(visitStats);
    } catch (error) {
      console.error("[이달 방문자 조회] 처리 오류:", error);
      setMonthlyVisitCount(0);
      setMonthlyVisitStats([]);
    } finally {
      setIsLoadingMonthlyVisits(false);
    }
  };

  return {
    todayVisitCount,
    monthlyVisitCount,
    monthlyVisitStats,
    isLoadingTodayVisits,
    isLoadingMonthlyVisits,
    refreshStats
  };
}
