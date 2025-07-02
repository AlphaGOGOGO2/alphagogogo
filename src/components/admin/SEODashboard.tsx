import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, AlertCircle, XCircle, RefreshCw } from "lucide-react";
import { BlogPost } from "@/types/blog";

interface SEOScore {
  postId: string;
  title: string;
  score: number;
  issues: string[];
  coverImage: string | null;
  hasMetaDescription: boolean;
  hasTags: boolean;
  titleLength: number;
  contentLength: number;
}

export function SEODashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [seoScores, setSeoScores] = useState<SEOScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFixingThumbnails, setIsFixingThumbnails] = useState(false);

  // SEO 점수 계산 함수
  const calculateSEOScore = (post: BlogPost): SEOScore => {
    let score = 0;
    const issues: string[] = [];

    // 제목 길이 체크 (30-60자 권장)
    const titleLength = post.title?.length || 0;
    if (titleLength >= 30 && titleLength <= 60) {
      score += 20;
    } else {
      issues.push(`제목 길이 최적화 필요 (현재: ${titleLength}자, 권장: 30-60자)`);
    }

    // 메타 설명 체크
    const hasMetaDescription = !!(post.excerpt && post.excerpt.length > 0);
    if (hasMetaDescription && post.excerpt!.length >= 120 && post.excerpt!.length <= 160) {
      score += 20;
    } else if (hasMetaDescription) {
      score += 10;
      issues.push(`메타 설명 길이 최적화 필요 (현재: ${post.excerpt!.length}자, 권장: 120-160자)`);
    } else {
      issues.push("메타 설명 누락");
    }

    // 커버 이미지 체크
    if (post.coverImage && post.coverImage.trim() !== '') {
      score += 20;
    } else {
      issues.push("커버 이미지 누락");
    }

    // 태그 체크
    const hasTags = !!(post.tags && post.tags.length > 0);
    if (hasTags && post.tags!.length >= 3) {
      score += 20;
    } else if (hasTags) {
      score += 10;
      issues.push("태그 개수 부족 (권장: 3개 이상)");
    } else {
      issues.push("태그 누락");
    }

    // 컨텐츠 길이 체크 (최소 300자 권장)
    const contentLength = post.content?.length || 0;
    if (contentLength >= 1000) {
      score += 20;
    } else if (contentLength >= 300) {
      score += 10;
      issues.push("컨텐츠 길이 부족 (권장: 1000자 이상)");
    } else {
      issues.push("컨텐츠 길이 심각하게 부족");
    }

    return {
      postId: post.id,
      title: post.title,
      score,
      issues,
      coverImage: post.coverImage,
      hasMetaDescription,
      hasTags,
      titleLength,
      contentLength
    };
  };

  // 블로그 포스트 데이터 로드
  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          id, title, excerpt, content, cover_image, category,
          blog_post_tags(blog_tags(name))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const adaptedPosts: BlogPost[] = data.map(post => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.cover_image,
          category: post.category,
          tags: post.blog_post_tags?.map((pt: any) => pt.blog_tags?.name).filter(Boolean) || [],
          author: { name: 'Default', avatar: '' },
          publishedAt: new Date().toISOString(),
          readTime: 5,
          slug: ''
        }));

        setPosts(adaptedPosts);
        
        // SEO 점수 계산
        const scores = adaptedPosts.map(calculateSEOScore);
        setSeoScores(scores);
      }
    } catch (error) {
      console.error('포스트 로드 실패:', error);
      toast.error('포스트 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 썸네일 자동 수정 함수
  const fixThumbnails = async () => {
    try {
      setIsFixingThumbnails(true);
      
      const { data, error } = await supabase.functions.invoke('fix-blog-thumbnails', {
        method: 'POST'
      });

      if (error) throw error;

      toast.success(`썸네일 수정 완료: ${data.updated}개 포스트 업데이트됨`);
      
      // 데이터 새로고침
      await loadPosts();
    } catch (error) {
      console.error('썸네일 수정 실패:', error);
      toast.error('썸네일 수정에 실패했습니다.');
    } finally {
      setIsFixingThumbnails(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // 전체 평균 SEO 점수 계산
  const averageScore = seoScores.length > 0 
    ? Math.round(seoScores.reduce((sum, score) => sum + score.score, 0) / seoScores.length)
    : 0;

  // SEO 점수별 색상
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
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
      {/* SEO 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">전체 평균 점수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
                {averageScore}점
              </div>
              <Progress value={averageScore} className="flex-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">우수 포스트</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                {seoScores.filter(s => s.score >= 80).length}
              </span>
              <span className="text-sm text-gray-500">개</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">개선 필요</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">
                {seoScores.filter(s => s.score >= 60 && s.score < 80).length}
              </span>
              <span className="text-sm text-gray-500">개</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">심각한 문제</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold text-red-600">
                {seoScores.filter(s => s.score < 60).length}
              </span>
              <span className="text-sm text-gray-500">개</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 액션 버튼들 */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={loadPosts} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          새로고침
        </Button>
        <Button 
          onClick={fixThumbnails} 
          variant="default" 
          size="sm"
          disabled={isFixingThumbnails}
        >
          {isFixingThumbnails ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4 mr-2" />
          )}
          썸네일 자동 수정
        </Button>
      </div>

      {/* 포스트별 SEO 점수 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>포스트별 SEO 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {seoScores.map((scoreData) => (
              <div key={scoreData.postId} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{scoreData.title}</h3>
                    <Badge variant={getScoreBadgeVariant(scoreData.score)}>
                      {scoreData.score}점
                    </Badge>
                  </div>
                  
                  {scoreData.issues.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">개선 필요 사항:</p>
                      {scoreData.issues.map((issue, index) => (
                        <p key={index} className="text-sm text-red-600">• {issue}</p>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="ml-4">
                  <Progress value={scoreData.score} className="w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}