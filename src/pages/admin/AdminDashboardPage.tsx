import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllBlogPostsForAdmin, getAllBlogCategories } from "@/services/blogService";
import { SEO } from "@/components/SEO";
import { FileText, TrendingUp, Users, Tag, Clock, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

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
  
  const [todayVisitCount, setTodayVisitCount] = useState<number | null>(null);
  const [monthlyVisitCount, setMonthlyVisitCount] = useState<number | null>(null);
  const [isLoadingVisits, setIsLoadingVisits] = useState(true);
  const [monthlyVisitStats, setMonthlyVisitStats] = useState<{ date: string; count: number }[]>([]);
  
  // 예약된 포스트 수 계산
  const scheduledPostsCount = posts.filter(post => new Date(post.publishedAt) > new Date()).length;
  
  // 방문자 수 조회 함수
  const fetchVisitCounts = async () => {
    try {
      setIsLoadingVisits(true);
      
      // 오늘 날짜 시작 시간 설정
      const todayStart = new Date();
      todayStart.setHours(0,0,0,0);
      const todayISO = todayStart.toISOString();

      // 오늘의 고유 방문자 수 조회
      const { data: todayData, error: todayError } = await supabase
        .from("visit_logs")
        .select("client_id, visited_at")
        .gte("visited_at", todayISO);
        
      if (todayError) {
        console.error("오늘 방문자 조회 오류:", todayError.message);
        setTodayVisitCount(0);
      } else if (todayData) {
        // 클라이언트 ID 기반 고유 방문자 계산 (중복 제거)
        const uniqueIds = new Set();
        
        todayData.forEach(log => {
          if (log.client_id && log.client_id.trim() !== '' && 
              log.client_id !== 'null' && log.client_id !== 'undefined') {
            uniqueIds.add(log.client_id);
          }
        });
        
        setTodayVisitCount(uniqueIds.size);
      }
      
      // 이번 달 시작 날짜 계산
      const currentMonth = new Date();
      const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const monthStartISO = monthStart.toISOString();
      
      // 이번 달의 고유 방문자 수 조회
      const { data: monthData, error: monthError } = await supabase
        .from("visit_logs")
        .select("client_id, visited_at")
        .gte("visited_at", monthStartISO);
        
      if (monthError) {
        console.error("월별 방문자 조회 오류:", monthError.message);
        setMonthlyVisitCount(0);
      } else if (monthData) {
        // 월별 통계를 위한 데이터 처리
        const dailyStats = new Map<string, Set<string>>();
        const uniqueMonthlyIds = new Set<string>();
        
        monthData.forEach(log => {
          if (log.client_id && log.client_id.trim() !== '' && 
              log.client_id !== 'null' && log.client_id !== 'undefined') {
            
            // 월별 총 고유 방문자
            uniqueMonthlyIds.add(log.client_id);
            
            // 일별 방문자 통계 계산
            const visitDate = new Date(log.visited_at).toISOString().split('T')[0];
            if (!dailyStats.has(visitDate)) {
              dailyStats.set(visitDate, new Set<string>());
            }
            dailyStats.get(visitDate)?.add(log.client_id);
          }
        });
        
        // 월별 총 고유 방문자 수 설정
        setMonthlyVisitCount(uniqueMonthlyIds.size);
        
        // 일별 방문자 통계 정렬 및 설정
        const visitStats = Array.from(dailyStats.entries())
          .map(([date, visitors]) => ({
            date: date,
            count: visitors.size
          }))
          .sort((a, b) => a.date.localeCompare(b.date));
          
        setMonthlyVisitStats(visitStats);
      }
      
      setIsLoadingVisits(false);
    } catch (err) {
      console.error("방문자 통계 처리 오류:", err);
      setIsLoadingVisits(false);
      setTodayVisitCount(0);
      setMonthlyVisitCount(0);
    }
  };
  
  useEffect(() => {
    // 데이터 로드
    fetchVisitCounts();
  }, []);

  return (
    <AdminLayout title="대시보드">
      <SEO 
        title="관리자 대시보드 | 알파GOGOGO" 
        description="알파GOGOGO 사이트 관리자 대시보드" 
      />
      
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">총 포스트</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-gray-500 mt-1">전체 블로그 포스트 수</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">카테고리</CardTitle>
            <Tag className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-gray-500 mt-1">전체 카테고리 수</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">최근 활동</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentPosts.length > 0 ? formatDate(recentPosts[0].publishedAt) : "없음"}
            </div>
            <p className="text-xs text-gray-500 mt-1">최근 포스트 등록일</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">예약 포스트</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scheduledPostsCount}
            </div>
            <p className="text-xs text-gray-500 mt-1">발행 예정 포스트 수</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">트렌딩</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                Object.entries(categoryPostCounts).length > 0 
                  ? Object.entries(categoryPostCounts)
                      .sort((a, b) => b[1] - a[1])[0][0]
                  : "없음"
              }
            </div>
            <p className="text-xs text-gray-500 mt-1">가장 많은 포스트가 있는 카테고리</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">오늘 방문자</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingVisits ? "로딩중" : (todayVisitCount !== null ? todayVisitCount : "오류")}
            </div>
            <p className="text-xs text-gray-500 mt-1">금일 고유 방문자 수</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">이달의 방문자</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingVisits ? "로딩중" : (monthlyVisitCount !== null ? monthlyVisitCount : "오류")}
            </div>
            <p className="text-xs text-gray-500 mt-1">이번 달 누적 고유 방문자 수</p>
            <div className="mt-2 text-xs text-gray-500">
              {new Date().getMonth() + 1}월 1일부터 현재까지
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* 방문자 통계 표 */}
      {monthlyVisitStats.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>이번 달 일별 방문자 통계</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>날짜</TableHead>
                  <TableHead className="text-right">방문자 수</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyVisitStats.map((stat) => (
                  <TableRow key={stat.date}>
                    <TableCell>{stat.date}</TableCell>
                    <TableCell className="text-right">{stat.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* 카테고리 요약 섹션 */}
      <Card className="mb-6 mt-6">
        <CardHeader>
          <CardTitle>카테고리 요약</CardTitle>
        </CardHeader>
        <CardContent>
          {categoriesLoading ? (
            <div className="text-center py-4">데이터 로딩 중...</div>
          ) : categories.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card key={category.id} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      포스트: {categoryPostCounts[category.name] || 0}개
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">카테고리가 없습니다.</div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
