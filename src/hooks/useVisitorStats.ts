
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface VisitStat {
  date: string;
  count: number;
}

interface VisitorStatsResult {
  todayVisitCount: number | null;
  monthlyVisitCount: number | null;
  monthlyVisitStats: VisitStat[];
  isLoadingVisits: boolean;
}

export function useVisitorStats(): VisitorStatsResult {
  const [todayVisitCount, setTodayVisitCount] = useState<number | null>(null);
  const [monthlyVisitCount, setMonthlyVisitCount] = useState<number | null>(null);
  const [isLoadingVisits, setIsLoadingVisits] = useState(true);
  const [monthlyVisitStats, setMonthlyVisitStats] = useState<VisitStat[]>([]);

  useEffect(() => {
    fetchVisitCounts();
  }, []);

  // 방문자 수 조회 함수
  const fetchVisitCounts = async () => {
    try {
      setIsLoadingVisits(true);
      
      // 현재 날짜와 시간
      const now = new Date();
      
      // 오늘 자정 (시작 시간)
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // 내일 자정 (종료 시간)
      const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      
      // 이번 달 시작 날짜
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      // 다음 달 시작 날짜 (이번 달의 종료 시간)
      const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      
      console.log("오늘 시작 시간:", todayStart.toISOString());
      console.log("내일 시작 시간:", tomorrowStart.toISOString());
      
      // 1. 오늘 방문자 데이터 쿼리 - 시작과 종료 시간 모두 지정
      const { data: todayVisits, error: todayError } = await supabase
        .from("visit_logs")
        .select("client_id, visited_at")
        .gte("visited_at", todayStart.toISOString())
        .lt("visited_at", tomorrowStart.toISOString());
      
      if (todayError) {
        console.error("오늘 방문자 조회 오류:", todayError);
        setTodayVisitCount(0);
      } else {
        // 오늘의 고유 방문자 ID 계산
        const uniqueTodayVisitors = new Set<string>();
        
        if (todayVisits) {
          console.log("오늘 방문 기록 데이터:", todayVisits.length);
          
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
        console.log("오늘 방문자 수 계산 결과:", todayCount);
        setTodayVisitCount(todayCount);
      }
      
      // 2. 이번 달 방문자 데이터 쿼리 - 시작과 종료 시간 모두 지정
      const { data: monthVisits, error: monthError } = await supabase
        .from("visit_logs")
        .select("client_id, visited_at")
        .gte("visited_at", monthStart.toISOString())
        .lt("visited_at", nextMonthStart.toISOString());
      
      if (monthError) {
        console.error("월별 방문자 조회 오류:", monthError);
        setMonthlyVisitCount(0);
      } else {
        // 이번 달 전체 고유 방문자 계산
        const uniqueMonthlyVisitors = new Set<string>();
        const dailyStats = new Map<string, Set<string>>();
        
        if (monthVisits) {
          console.log("이번 달 방문 기록 데이터:", monthVisits.length);
          
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
        console.log("이번 달 방문자 수 계산 결과:", monthlyCount);
        setMonthlyVisitCount(monthlyCount);
        
        // 일별 방문자 통계 정렬 및 설정
        const visitStats = Array.from(dailyStats.entries())
          .map(([date, visitors]) => ({
            date: date,
            count: visitors.size
          }))
          .sort((a, b) => b.date.localeCompare(a.date)); // 최신 날짜가 먼저 오도록 정렬
        
        setMonthlyVisitStats(visitStats);
      }
      
      setIsLoadingVisits(false);
    } catch (error) {
      console.error("방문자 통계 처리 오류:", error);
      setIsLoadingVisits(false);
      setTodayVisitCount(0);
      setMonthlyVisitCount(0);
    }
  };

  return {
    todayVisitCount,
    monthlyVisitCount,
    monthlyVisitStats,
    isLoadingVisits
  };
}
