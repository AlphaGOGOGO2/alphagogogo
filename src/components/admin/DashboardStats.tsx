
import React from "react";
import { StatCard } from "./StatCard";
import { FileText, TrendingUp, Users, Tag, Clock, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { logDebug } from "@/utils/logger";

interface CategorySummary {
  name: string;
  count: number;
}

interface BlogPostSummary {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
  readTime: number;
  excerpt?: string;
  slug: string;
}

interface DashboardStatsProps {
  posts: BlogPostSummary[];
  categories: CategorySummary[];
  categoryPostCounts: Record<string, number>;
  recentPosts: BlogPostSummary[];
  scheduledPostsCount: number;
  todayVisitCount: number | null;
  monthlyVisitCount: number | null;
  isLoadingTodayVisits: boolean;
  isLoadingMonthlyVisits: boolean;
}

export function DashboardStats({
  posts,
  categories,
  categoryPostCounts,
  recentPosts,
  scheduledPostsCount,
  todayVisitCount,
  monthlyVisitCount,
  isLoadingTodayVisits,
  isLoadingMonthlyVisits
}: DashboardStatsProps) {
  
  const trendingCategory = Object.entries(categoryPostCounts).length > 0 
    ? Object.entries(categoryPostCounts).sort((a, b) => b[1] - a[1])[0][0]
    : "없음";
  
  const today = new Date();
  
  // 개발환경에서만 디버깅 로그 출력
  logDebug("[DashboardStats] Visitor stats loaded");
  
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
        value={recentPosts.length > 0 ? formatDate(recentPosts[0]!.publishedAt) : "없음"}
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
      
      {/* 오늘 방문자 카드 - 개선: 명확한 로딩 상태 표시 */}
      <StatCard
        title="오늘 방문자"
        value={isLoadingTodayVisits ? "로딩중" : (todayVisitCount !== null ? todayVisitCount : "오류")}
        description="금일 고유 방문자 수"
        icon={Users}
        loading={isLoadingTodayVisits}
        additionalInfo={`오늘(${today.getMonth() + 1}월 ${today.getDate()}일) 방문자`}
      />
      
      {/* 이달 방문자 카드 - 개선: 명확한 로딩 상태 표시 */}
      <StatCard
        title="이달 방문자"
        value={isLoadingMonthlyVisits ? "로딩중" : (monthlyVisitCount !== null ? monthlyVisitCount : "오류")}
        description="이번 달 누적 고유 방문자 수"
        icon={Users}
        loading={isLoadingMonthlyVisits}
        additionalInfo={`${today.getMonth() + 1}월 1일부터 현재까지`}
      />
    </div>
  );
}
