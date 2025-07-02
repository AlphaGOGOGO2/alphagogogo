import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, AlertCircle, Search, RefreshCw, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getAllBlogPosts } from "@/services/blogPostRetrieveService";
import { BlogPost } from "@/types/blog";

interface BlogSEOManagementProps {}

interface SEOIssue {
  type: 'title' | 'excerpt' | 'cover_image' | 'slug';
  severity: 'error' | 'warning';
  message: string;
  postId: string;
  postTitle: string;
}

export function BlogSEOManagement({}: BlogSEOManagementProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [seoIssues, setSeoIssues] = useState<SEOIssue[]>([]);
  const [filter, setFilter] = useState<'all' | 'errors' | 'warnings'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const fetchedPosts = await getAllBlogPosts();
      setPosts(fetchedPosts);
      analyzeSEOIssues(fetchedPosts);
    } catch (error) {
      console.error('포스트 로딩 오류:', error);
      toast.error('포스트를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeSEOIssues = (posts: BlogPost[]) => {
    const issues: SEOIssue[] = [];

    posts.forEach(post => {
      // 제목 검사
      if (!post.title || post.title.trim() === '') {
        issues.push({
          type: 'title',
          severity: 'error',
          message: '제목이 없습니다',
          postId: post.id,
          postTitle: post.title || '제목 없음'
        });
      } else if (post.title.length < 10) {
        issues.push({
          type: 'title',
          severity: 'warning',
          message: '제목이 너무 짧습니다 (10자 미만)',
          postId: post.id,
          postTitle: post.title
        });
      } else if (post.title.length > 60) {
        issues.push({
          type: 'title',
          severity: 'warning',
          message: '제목이 너무 깁니다 (60자 초과)',
          postId: post.id,
          postTitle: post.title
        });
      }

      // 발췌문 검사
      if (!post.excerpt || post.excerpt.trim() === '') {
        issues.push({
          type: 'excerpt',
          severity: 'warning',
          message: '발췌문이 없습니다',
          postId: post.id,
          postTitle: post.title || '제목 없음'
        });
      } else if (post.excerpt.length < 50) {
        issues.push({
          type: 'excerpt',
          severity: 'warning',
          message: '발췌문이 너무 짧습니다 (50자 미만)',
          postId: post.id,
          postTitle: post.title || '제목 없음'
        });
      } else if (post.excerpt.length > 160) {
        issues.push({
          type: 'excerpt',
          severity: 'warning',
          message: '발췌문이 너무 깁니다 (160자 초과)',
          postId: post.id,
          postTitle: post.title || '제목 없음'
        });
      }

      // 커버 이미지 검사
      if (!post.coverImage) {
        issues.push({
          type: 'cover_image',
          severity: 'warning',
          message: '커버 이미지가 없습니다',
          postId: post.id,
          postTitle: post.title || '제목 없음'
        });
      }

      // 슬러그 검사
      if (!post.slug || post.slug.trim() === '') {
        issues.push({
          type: 'slug',
          severity: 'error',
          message: 'URL 슬러그가 없습니다',
          postId: post.id,
          postTitle: post.title || '제목 없음'
        });
      }
    });

    setSeoIssues(issues);
  };

  const fixAllThumbnails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('run-thumbnail-fix');
      if (error) throw error;
      
      toast.success('썸네일 수정이 완료되었습니다.');
      await loadPosts(); // 다시 로드하여 변경사항 반영
    } catch (error) {
      console.error('썸네일 수정 오류:', error);
      toast.error('썸네일 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getIssueIcon = (severity: 'error' | 'warning') => {
    return severity === 'error' ? 
      <XCircle className="w-4 h-4 text-red-500" /> : 
      <AlertCircle className="w-4 h-4 text-yellow-500" />;
  };

  const getIssueColor = (severity: 'error' | 'warning') => {
    return severity === 'error' ? 'text-red-700 bg-red-50 border-red-200' : 'text-yellow-700 bg-yellow-50 border-yellow-200';
  };

  const filteredIssues = seoIssues.filter(issue => {
    const matchesFilter = filter === 'all' || issue.severity === filter.slice(0, -1) as 'error' | 'warning';
    const matchesSearch = searchTerm === '' || 
      issue.postTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const errorCount = seoIssues.filter(issue => issue.severity === 'error').length;
  const warningCount = seoIssues.filter(issue => issue.severity === 'warning').length;

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
            <div className="text-sm text-gray-500">총 포스트</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
            <div className="text-sm text-gray-500">심각한 오류</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
            <div className="text-sm text-gray-500">경고</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {posts.length - errorCount - warningCount > 0 ? posts.length - errorCount - warningCount : 0}
            </div>
            <div className="text-sm text-gray-500">문제없음</div>
          </CardContent>
        </Card>
      </div>

      {/* 액션 버튼 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>블로그 SEO 관리</CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={loadPosts}
                disabled={loading}
                variant="outline"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                새로고침
              </Button>
              <Button
                onClick={fixAllThumbnails}
                disabled={loading}
                variant="default"
              >
                썸네일 일괄 수정
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* 필터 및 검색 */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                전체 ({seoIssues.length})
              </Button>
              <Button
                variant={filter === 'errors' ? 'destructive' : 'outline'}
                onClick={() => setFilter('errors')}
                size="sm"
              >
                오류 ({errorCount})
              </Button>
              <Button
                variant={filter === 'warnings' ? 'secondary' : 'outline'}
                onClick={() => setFilter('warnings')}
                size="sm"
              >
                경고 ({warningCount})
              </Button>
            </div>
            
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="포스트 제목 또는 문제 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* SEO 문제 목록 */}
          <div className="space-y-3">
            {filteredIssues.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === 'all' ? 'SEO 문제가 없습니다!' : `${filter === 'errors' ? '오류' : '경고'}가 없습니다!`}
                </h3>
                <p className="text-gray-500">
                  {filter === 'all' ? '모든 블로그 포스트가 SEO 최적화되어 있습니다.' : '해당 유형의 문제가 발견되지 않았습니다.'}
                </p>
              </div>
            ) : (
              filteredIssues.map((issue, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg ${getIssueColor(issue.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getIssueIcon(issue.severity)}
                      <div className="flex-1">
                        <h4 className="font-medium">{issue.postTitle}</h4>
                        <p className="text-sm mt-1">{issue.message}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {issue.type === 'title' && '제목'}
                            {issue.type === 'excerpt' && '발췌문'}
                            {issue.type === 'cover_image' && '커버이미지'}
                            {issue.type === 'slug' && 'URL'}
                          </Badge>
                          <Badge 
                            variant={issue.severity === 'error' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {issue.severity === 'error' ? '오류' : '경고'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/admin/posts`, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}