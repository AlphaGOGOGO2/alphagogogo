/**
 * 로컬 모드 블로그 관리 페이지
 * 블로그 포스트 목록 확인 및 데이터 파일 편집 안내
 */

import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Code, ExternalLink, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { blogPosts as staticBlogPosts } from "@/data/blogPosts";
import { formatDate } from "@/lib/utils";
import * as localBlogService from "@/services/localBlogService";

export default function AdminBlog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [markdownPosts, setMarkdownPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const posts = await localBlogService.getAllBlogPosts();
      setMarkdownPosts(posts);
    } catch (error) {
      console.error('Failed to load markdown posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Combine static posts and markdown posts
  const allPosts = [...staticBlogPosts, ...markdownPosts];

  const filteredPosts = allPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <SEO
        title="블로그 관리 - 로컬 모드"
        description="블로그 포스트 관리"
        noIndex
      />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-2">
              <Link to="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                대시보드로 돌아가기
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">블로그 관리</h1>
            <p className="text-muted-foreground">
              총 {allPosts.length}개의 포스트 ({staticBlogPosts.length}개 정적 + {markdownPosts.length}개 Markdown)
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadPosts} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
            <Button asChild>
              <a href="vscode://file/D:/저장용/alphagogogo/alphagogogo/src/data/blogPosts.ts">
                <Code className="mr-2 h-4 w-4" />
                데이터 파일 편집
              </a>
            </Button>
          </div>
        </div>

        {/* 검색 */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="제목이나 카테고리로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* 포스트 목록 */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12 text-muted-foreground">
                검색 결과가 없습니다
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{post.title}</CardTitle>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{post.category}</Badge>
                        <span>•</span>
                        <span>{formatDate(post.publishedAt)}</span>
                        {post.views !== undefined && (
                          <>
                            <span>•</span>
                            <span>조회수: {post.views.toLocaleString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/blog/${post.slug}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                {post.excerpt && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {/* 안내 */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-900">편집 방법</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-yellow-800 space-y-2">
            <p>1. 위의 "데이터 파일 편집" 버튼을 클릭하여 VS Code에서 파일을 엽니다</p>
            <p>2. <code className="bg-yellow-100 px-1 rounded">blogPosts</code> 배열을 수정합니다</p>
            <p>3. 파일을 저장하면 자동으로 핫 리로드됩니다</p>
            <p className="pt-2 border-t border-yellow-200">
              💡 <strong>팁:</strong> TypeScript 타입 체크가 자동으로 되므로 오류를 방지할 수 있습니다
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
