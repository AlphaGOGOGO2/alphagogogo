import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, AlertCircle, XCircle, RefreshCw, Image, Settings, Clock } from "lucide-react";

export function SEODashboard() {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFixingThumbnails, setIsFixingThumbnails] = useState(false);
  const [seoStats, setSeoStats] = useState({
    totalPosts: 0,
    postsWithImages: 0,
    postsWithoutImages: 0,
    averageSeoScore: 0
  });

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBlogPosts(data || []);
      
      if (data) {
        const totalPosts = data.length;
        const postsWithImages = data.filter(post => post.cover_image && post.cover_image.trim() !== '').length;
        const postsWithoutImages = totalPosts - postsWithImages;
        
        const scores = data.map(post => calculateSEOScore(post));
        const averageSeoScore = scores.length > 0 
          ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
          : 0;

        setSeoStats({
          totalPosts,
          postsWithImages,
          postsWithoutImages,
          averageSeoScore
        });
      }
    } catch (error) {
      console.error('포스트 로드 실패:', error);
      toast.error('포스트 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSEOScore = (post: any): number => {
    let score = 0;
    
    // 제목 길이 체크 (30-60자 권장)
    if (post.title && post.title.length >= 30 && post.title.length <= 60) {
      score += 20;
    }
    
    // 메타 설명 체크
    if (post.excerpt && post.excerpt.length >= 120 && post.excerpt.length <= 160) {
      score += 20;
    } else if (post.excerpt) {
      score += 10;
    }
    
    // 커버 이미지 체크
    if (post.cover_image && post.cover_image.trim() !== '') {
      score += 20;
    }
    
    // 컨텐츠 길이 체크
    if (post.content && post.content.length >= 300) {
      score += 20;
    }
    
    // 카테고리 체크
    if (post.category) {
      score += 20;
    }
    
    return score;
  };

  const handleFixThumbnails = async () => {
    setIsFixingThumbnails(true);
    toast.info("썸네일 수정 작업을 시작합니다...");
    
    try {
      const { data, error } = await supabase.functions.invoke('fix-blog-thumbnails');
      
      if (error) {
        console.error('썸네일 수정 함수 에러:', error);
        throw error;
      }
      
      if (data?.success) {
        toast.success(`썸네일 수정 완료! ${data.updated}개 포스트가 업데이트되었습니다.`);
        fetchBlogPosts(); // 데이터 새로고침
      } else {
        toast.error(data?.message || "썸네일 수정 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error('썸네일 수정 에러:', error);
      toast.error("썸네일 수정 중 오류가 발생했습니다.");
    } finally {
      setIsFixingThumbnails(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">SEO 데이터 분석 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 전체 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <RefreshCw className="h-8 w-8 text-blue-500" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">총 포스트</p>
                <p className="text-2xl font-bold">{seoStats.totalPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">썸네일 있음</p>
                <p className="text-2xl font-bold">{seoStats.postsWithImages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-orange-500" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">썸네일 없음</p>
                <p className="text-2xl font-bold">{seoStats.postsWithoutImages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-purple-500" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">평균 SEO 점수</p>
                <p className="text-2xl font-bold">{seoStats.averageSeoScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 썸네일 관리 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            썸네일 관리
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">썸네일 자동 수정</h3>
                <p className="text-sm text-gray-500">
                  cover_image가 누락된 포스트의 썸네일을 content에서 자동 추출하거나 카테고리별 기본 이미지로 설정합니다.
                </p>
              </div>
              <Button 
                onClick={handleFixThumbnails}
                disabled={isFixingThumbnails}
                className="ml-4"
              >
                {isFixingThumbnails ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    수정 중...
                  </>
                ) : (
                  <>
                    <Settings className="mr-2 h-4 w-4" />
                    썸네일 자동 수정
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* 포스트별 SEO 분석 */}
      <Card>
        <CardHeader>
          <CardTitle>포스트별 SEO 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {blogPosts.length === 0 ? (
              <p className="text-center text-gray-500 py-8">분석할 포스트가 없습니다.</p>
            ) : (
              blogPosts.map((post) => {
                const seoScore = calculateSEOScore(post);
                return (
                  <div key={post.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium truncate flex-1">{post.title}</h3>
                      <Badge 
                        variant={seoScore >= 80 ? "default" : seoScore >= 60 ? "secondary" : "destructive"}
                      >
                        SEO 점수: {seoScore}%
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center">
                        {post.cover_image ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span>썸네일</span>
                      </div>
                      
                      <div className="flex items-center">
                        {post.excerpt ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span>메타 설명</span>
                      </div>
                      
                      <div className="flex items-center">
                        {post.title && post.title.length >= 30 && post.title.length <= 60 ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-orange-500 mr-1" />
                        )}
                        <span>제목 길이 ({post.title?.length || 0}자)</span>
                      </div>
                      
                      <div className="flex items-center">
                        {post.content && post.content.length >= 300 ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span>콘텐츠 길이</span>
                      </div>
                    </div>
                    
                    <Progress value={seoScore} className="mt-2" />
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}