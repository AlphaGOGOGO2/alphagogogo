/**
 * 로컬 모드 관리자 대시보드
 * 블로그와 자료실 데이터 파일 관리 안내
 */

import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FolderOpen, Code, Info, PenTool, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import { resources } from "@/data/resources";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <SEO
        title="관리자 대시보드 - 로컬 모드"
        description="로컬 데이터 관리"
        noIndex
      />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* 헤더 */}
        <div>
          <h1 className="text-3xl font-bold mb-2">관리자 대시보드</h1>
          <p className="text-muted-foreground">
            로컬 모드로 운영 중 - 모든 데이터는 코드 파일에서 관리됩니다
          </p>
        </div>

        {/* 통계 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">블로그 포스트</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogPosts.length}</div>
              <p className="text-xs text-muted-foreground">
                총 {blogPosts.filter(p => new Date(p.publishedAt) <= new Date()).length}개 게시됨
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">자료실</CardTitle>
              <FolderOpen className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resources.length}</div>
              <p className="text-xs text-muted-foreground">
                다운로드 가능한 파일
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 빠른 작업 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-900">📝 새 글 작성</CardTitle>
              <CardDescription>마크다운으로 블로그 글 작성하기</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                <Link to="/admin/blog/write">
                  <PenTool className="mr-2 h-4 w-4" />
                  글 작성하기
                </Link>
              </Button>
              <p className="text-xs text-purple-700">
                💡 로컬 API 서버가 실행 중이어야 합니다 (npm run dev:api)
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900">📁 파일 업로드</CardTitle>
              <CardDescription>자료실 파일 업로드 및 관리</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link to="/admin/resources/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  파일 업로드
                </Link>
              </Button>
              <p className="text-xs text-green-700">
                💡 최대 200MB까지 업로드 가능
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 관리 링크 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>블로그 관리</CardTitle>
              <CardDescription>블로그 포스트 확인 및 데이터 파일 편집</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/admin/blog">
                  <FileText className="mr-2 h-4 w-4" />
                  블로그 관리하기
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>자료실 관리</CardTitle>
              <CardDescription>자료실 파일 확인 및 데이터 파일 편집</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link to="/admin/resources">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  자료실 관리하기
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 로컬 모드 안내 */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-blue-900">로컬 모드 안내</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-blue-800 space-y-3">
            <div>
              <p className="font-semibold mb-1">📝 블로그 포스트 관리</p>
              <p>파일: <code className="bg-blue-100 px-2 py-1 rounded">src/data/blogPosts.ts</code></p>
              <p className="text-xs mt-1">코드 에디터에서 직접 수정하세요</p>
            </div>

            <div>
              <p className="font-semibold mb-1">📦 자료실 관리</p>
              <p>데이터: <code className="bg-blue-100 px-2 py-1 rounded">src/data/resources.ts</code></p>
              <p>파일: <code className="bg-blue-100 px-2 py-1 rounded">public/files/</code> 폴더</p>
              <p className="text-xs mt-1">파일을 public/files/ 폴더에 직접 배치하세요</p>
            </div>

            <div className="pt-2 border-t border-blue-200">
              <p className="font-semibold">💡 팁</p>
              <ul className="text-xs list-disc list-inside space-y-1 mt-1">
                <li>VS Code에서 데이터 파일을 직접 편집하는 것이 가장 빠릅니다</li>
                <li>변경사항은 자동으로 핫 리로드됩니다</li>
                <li>파일 업로드는 지원하지 않으며 직접 배치해야 합니다</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 빠른 액세스 */}
        <Card>
          <CardHeader>
            <CardTitle>빠른 액세스</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="vscode://file/D:/저장용/alphagogogo/alphagogogo/src/data/blogPosts.ts">
                <Code className="mr-2 h-3 w-3" />
                blogPosts.ts 열기
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="vscode://file/D:/저장용/alphagogogo/alphagogogo/src/data/resources.ts">
                <Code className="mr-2 h-3 w-3" />
                resources.ts 열기
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="file:///D:/저장용/alphagogogo/alphagogogo/public/files">
                <FolderOpen className="mr-2 h-3 w-3" />
                files 폴더 열기
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
