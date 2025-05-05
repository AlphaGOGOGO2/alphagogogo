
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";

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
  const [weeklyVisits, setWeeklyVisits] = useState<any[]>([]);
  const [isLoadingVisits, setIsLoadingVisits] = useState(true);
  
  // 예약된 포스트 수 계산
  const scheduledPostsCount = posts.filter(post => new Date(post.publishedAt) > new Date()).length;
  
  useEffect(() => {
    async function fetchTodayCount() {
      try {
        setIsLoadingVisits(true);
        const todayStart = new Date();
        todayStart.setHours(0,0,0,0);
        const todayISO = todayStart.toISOString();

        // 오늘의 고유 방문자 수 조회
        const { data, error } = await supabase
          .from("visit_logs")
          .select("id");
          
        if (error) {
          console.error("방문자 데이터 조회 실패:", error);
          setTodayVisitCount(0);
        } else if (data) {
          // 고유 ID 수를 계산 (client_id가 없는 경우 id 기준)
          setTodayVisitCount(data.length);
        }
        
        // 최근 7일간 방문자 통계 조회
        await fetchWeeklyStats();
        
        setIsLoadingVisits(false);
      } catch (err) {
        console.error("방문자 통계 처리 오류:", err);
        setIsLoadingVisits(false);
        setTodayVisitCount(0);
      }
    }
    
    async function fetchWeeklyStats() {
      try {
        // 최근 7일 날짜 배열 생성
        const days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          return date;
        }).reverse();
        
        // 각 날짜별 방문자 수 조회
        const statsPromises = days.map(async (day) => {
          const nextDay = new Date(day);
          nextDay.setDate(nextDay.getDate() + 1);
          
          const { data, error } = await supabase
            .from("visit_logs")
            .select("id")
            .gte("visited_at", day.toISOString())
            .lt("visited_at", nextDay.toISOString());
            
          if (error) {
            console.error("일별 방문 통계 조회 실패:", error);
            return {
              date: day.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }),
              visitors: 0
            };
          }
          
          if (data) {
            // 방문자 수를 계산
            const uniqueVisitors = data.length;
            
            // 날짜 포맷 (월/일)
            const month = day.getMonth() + 1;
            const date = day.getDate();
            const formattedDate = `${month}/${date}`;
            
            return {
              date: formattedDate,
              visitors: uniqueVisitors
            };
          }
          
          return {
            date: day.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }),
            visitors: 0
          };
        });
        
        const weekStats = await Promise.all(statsPromises);
        setWeeklyVisits(weekStats);
      } catch (err) {
        console.error("주간 통계 조회 오류:", err);
        setWeeklyVisits([]);
      }
    }
    
    fetchTodayCount();
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
      </div>
      
      {/* 방문자 차트 컴포넌트 - 더 높은 높이와 마진 적용 */}
      <Card className="mb-10">
        <CardHeader>
          <CardTitle>최근 7일 방문자 추이</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {isLoadingVisits ? (
            <div className="flex items-center justify-center h-80">
              <p>데이터 로딩 중...</p>
            </div>
          ) : (
            <div className="h-80">
              <ChartContainer
                config={{
                  visitors: {
                    label: "방문자",
                    theme: {
                      light: "#7c3aed",
                      dark: "#9f67ff",
                    },
                  }
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={weeklyVisits}
                    margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis 
                      width={30}
                      tickCount={5}
                      tickFormatter={(value) => value.toString()}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                    <Bar 
                      dataKey="visitors" 
                      name="visitors" 
                      fill="#7c3aed" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* 카테고리 요약 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>카테고리 요약</CardTitle>
        </CardHeader>
        <CardContent>
          {categoriesLoading ? (
            <div className="text-center py-4">데이터 로딩 중...</div>
          ) : categories.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card key={category.id}>
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
