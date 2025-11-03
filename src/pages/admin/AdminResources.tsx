/**
 * 로컬 모드 자료실 관리 페이지
 * 자료실 파일 목록 확인 및 데이터 파일 편집 안내
 */

import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Code, Download, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { resources } from "@/data/resources";

export default function AdminResources() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <SEO
        title="자료실 관리 - 로컬 모드"
        description="자료실 파일 관리"
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
            <h1 className="text-3xl font-bold">자료실 관리</h1>
            <p className="text-muted-foreground">총 {resources.length}개의 파일</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <a href="file:///D:/저장용/alphagogogo/alphagogogo/public/files">
                <FolderOpen className="mr-2 h-4 w-4" />
                files 폴더
              </a>
            </Button>
            <Button asChild>
              <a href="vscode://file/D:/저장용/alphagogogo/alphagogogo/src/data/resources.ts">
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
                placeholder="제목, 카테고리, 태그로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* 파일 목록 */}
        <div className="space-y-4">
          {filteredResources.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12 text-muted-foreground">
                검색 결과가 없습니다
              </CardContent>
            </Card>
          ) : (
            filteredResources.map((resource) => (
              <Card key={resource.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{resource.title}</CardTitle>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Badge variant="outline">{resource.category}</Badge>
                        {resource.tags.map(tag => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={resource.file_url} download>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>크기: {formatFileSize(resource.file_size)}</span>
                    <span>•</span>
                    <span>다운로드: {resource.download_count.toLocaleString()}회</span>
                    <span>•</span>
                    <span>작성자: {resource.author_name}</span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    파일 경로: <code className="bg-gray-100 px-1 rounded">{resource.file_url}</code>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* 안내 */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-900">파일 관리 방법</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-yellow-800 space-y-2">
            <p className="font-semibold">📁 파일 추가</p>
            <p>1. 파일을 <code className="bg-yellow-100 px-1 rounded">public/files/</code> 폴더에 배치합니다</p>
            <p>2. <code className="bg-yellow-100 px-1 rounded">resources.ts</code>에 파일 정보를 추가합니다</p>
            <p>3. <code className="bg-yellow-100 px-1 rounded">file_url</code>을 <code className="bg-yellow-100 px-1 rounded">/files/파일명</code> 형식으로 지정합니다</p>

            <p className="font-semibold pt-2 border-t border-yellow-200">✏️ 데이터 수정</p>
            <p>1. "데이터 파일 편집" 버튼을 클릭하여 VS Code에서 파일을 엽니다</p>
            <p>2. <code className="bg-yellow-100 px-1 rounded">resources</code> 배열을 수정합니다</p>
            <p>3. 파일을 저장하면 자동으로 적용됩니다</p>

            <p className="pt-2 border-t border-yellow-200">
              💡 <strong>팁:</strong> 파일명은 영문으로 하는 것이 URL 호환성에 좋습니다
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
