
import React from "react";
import { StatCard } from "./StatCard";
import { FileText, TrendingUp, Users, Tag, Clock, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface DashboardStatsProps {
  posts: any[];
  categories: any[];
  categoryPostCounts: Record<string, number>;
  recentPosts: any[];
  scheduledPostsCount: number;
  todayVisitCount: number | null;
  monthlyVisitCount: number | null;
  isLoadingVisits: boolean;
}

export function DashboardStats({
  posts,
  categories,
  categoryPostCounts,
  recentPosts,
  scheduledPostsCount,
  todayVisitCount,
  monthlyVisitCount,
  isLoadingVisits
}: DashboardStatsProps) {
  
  const trendingCategory = Object.entries(categoryPostCounts).length > 0 
    ? Object.entries(categoryPostCounts).sort((a, b) => b[1] - a[1])[0][0]
    : "없음";
  
  const today = new Date();
  
  // 디버깅을 위한 로그 추가
  console.log("[DashboardStats 컴포넌트] 오늘 방문자:", todayVisitCount, "이달 방문자:", monthlyVisitCount);
  
  return (
    <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="총 포스트"
        value={posts.length}
        description="전체 블로그 포스트 수"
        icon={FileText}
      />
      
      <StatCard
        title="카테고리"
        value={categories.length}
        description="전체 카테고리 수"
        icon={Tag}
      />
      
      <StatCard
        title="최근 활동"
        value={recentPosts.length > 0 ? formatDate(recentPosts[0].publishedAt) : "없음"}
        description="최근 포스트 등록일"
        icon={Clock}
      />
      
      <StatCard
        title="예약 포스트"
        value={scheduledPostsCount}
        description="발행 예정 포스트 수"
        icon={Calendar}
      />
      
      <StatCard
        title="트렌딩"
        value={trendingCategory}
        description="가장 많은 포스트가 있는 카테고리"
        icon={TrendingUp}
      />
      
      {/* 오늘 방문자 카드 */}
      <StatCard
        title="오늘 방문자"
        value={isLoadingVisits ? "로딩중" : (todayVisitCount !== null ? todayVisitCount : "오류")}
        description="금일 고유 방문자 수"
        icon={Users}
        loading={isLoadingVisits}
        additionalInfo={`오늘(${today.getMonth() + 1}월 ${today.getDate()}일) 방문자`}
      />
      
      {/* 이달 방문자 카드 */}
      <StatCard
        title="이달 방문자"
        value={isLoadingVisits ? "로딩중" : (monthlyVisitCount !== null ? monthlyVisitCount : "오류")}
        description="이번 달 누적 고유 방문자 수"
        icon={Users}
        loading={isLoadingVisits}
        additionalInfo={`${today.getMonth() + 1}월 1일부터 현재까지`}
      />
    </div>
  );
}
