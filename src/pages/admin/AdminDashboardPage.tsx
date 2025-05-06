
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { getAllBlogPostsForAdmin, getAllBlogCategories } from "@/services/blogService";
import { SEO } from "@/components/SEO";
import { useVisitorStats } from "@/hooks/useVisitorStats";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { VisitorStatsTable } from "@/components/admin/VisitorStatsTable";
import { CategorySummary } from "@/components/admin/CategorySummary";

export default function AdminDashboardPage() {
  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["all-blog-posts-admin"],
    queryFn: getAllBlogPostsForAdmin
  });
  
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: getAllBlogCategories
  });
  
  const categoryPostCounts = posts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 5);
  
  // 예약된 포스트 수 계산
  const scheduledPostsCount = posts.filter(post => new Date(post.publishedAt) > new Date()).length;
  
  // 방문자 통계 훅 사용
  const { 
    todayVisitCount, 
    monthlyVisitCount, 
    monthlyVisitStats,
    isLoadingVisits 
  } = useVisitorStats();

  // 디버깅을 위한 로그 추가
  console.log("[AdminDashboardPage] 오늘 방문자:", todayVisitCount, "이달 방문자:", monthlyVisitCount);

  return (
    <AdminLayout title="대시보드">
      <SEO 
        title="관리자 대시보드 | 알파GOGOGO" 
        description="알파GOGOGO 사이트 관리자 대시보드" 
      />
      
      {/* 대시보드 통계 카드 */}
      <DashboardStats 
        posts={posts}
        categories={categories}
        categoryPostCounts={categoryPostCounts}
        recentPosts={recentPosts}
        scheduledPostsCount={scheduledPostsCount}
        todayVisitCount={todayVisitCount}
        monthlyVisitCount={monthlyVisitCount}
        isLoadingVisits={isLoadingVisits}
      />
      
      {/* 방문자 통계 표 */}
      <VisitorStatsTable 
        stats={monthlyVisitStats} 
        loading={isLoadingVisits}
      />
      
      {/* 카테고리 요약 섹션 */}
      <CategorySummary 
        categories={categories}
        categoryPostCounts={categoryPostCounts}
        isLoading={categoriesLoading}
      />
    </AdminLayout>
  );
}
