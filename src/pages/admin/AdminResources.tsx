/**
 * 로컬 모드 자료실 관리 페이지
 * 자료실 파일 업로드 및 관리
 */

import { useState, useRef } from "react";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Code, Download, FolderOpen, Upload, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { resources } from "@/data/resources";
import { useToast } from "@/hooks/use-toast";

// API 키 헤더 생성 함수
const getAPIHeaders = () => ({
  'x-api-key': import.meta.env.VITE_API_KEY || 'alphagogo-admin-2024-secure-key'
});

export default function AdminResources() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    category: "문서",
    tags: ""
  });

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

  const handleDelete = async (resourceId: string, resourceTitle: string) => {
    if (!confirm(`정말로 "${resourceTitle}"을(를) 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/resources/${resourceId}`, {
        method: 'DELETE',
        headers: getAPIHeaders()
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "삭제 완료!",
          description: `"${resourceTitle}"이(가) 삭제되었습니다.`,
        });

        // 페이지 새로고침 안내
        setTimeout(() => {
          toast({
            title: "페이지 새로고침",
            description: "변경사항을 확인하려면 페이지를 새로고침하세요.",
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "삭제 실패",
        description: "파일 삭제 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast({
        title: "파일 선택 필요",
        description: "업로드할 파일을 선택해주세요.",
        variant: "destructive"
      });
      return;
    }

    if (!uploadData.title) {
      toast({
        title: "제목 입력 필요",
        description: "파일 제목을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', uploadData.title);
      formData.append('description', uploadData.description);
      formData.append('category', uploadData.category);
      formData.append('tags', JSON.stringify(uploadData.tags.split(',').map(t => t.trim()).filter(Boolean)));

      const response = await fetch('http://localhost:3001/api/resources/upload', {
        method: 'POST',
        headers: getAPIHeaders(),
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "업로드 완료!",
          description: `${file.name} 파일이 성공적으로 업로드되었습니다.`,
        });

        // 폼 초기화
        setUploadData({
          title: "",
          description: "",
          category: "문서",
          tags: ""
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // 페이지 새로고침 안내
        toast({
          title: "페이지 새로고침",
          description: "업로드된 파일을 확인하려면 페이지를 새로고침하세요.",
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "업로드 실패",
        description: "파일 업로드 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
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

        {/* 파일 업로드 */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">📁 파일 업로드</CardTitle>
            <CardDescription>자료실에 새 파일 업로드</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label htmlFor="file" className="text-sm">파일 선택 *</Label>
                  <Input
                    id="file"
                    ref={fileInputRef}
                    type="file"
                    className="mt-1"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="title" className="text-sm">제목 *</Label>
                  <Input
                    id="title"
                    value={uploadData.title}
                    onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="파일 제목"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm">카테고리</Label>
                  <Input
                    id="category"
                    value={uploadData.category}
                    onChange={(e) => setUploadData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="문서, 이미지 등"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="tags" className="text-sm">태그</Label>
                  <Input
                    id="tags"
                    value={uploadData.tags}
                    onChange={(e) => setUploadData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="태그1, 태그2"
                    className="mt-1"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="description" className="text-sm">설명</Label>
                  <Textarea
                    id="description"
                    value={uploadData.description}
                    onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="파일 설명 (선택사항)"
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </div>

              <Button onClick={handleFileUpload} disabled={isUploading} className="w-full bg-green-600 hover:bg-green-700">
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? "업로드 중..." : "파일 업로드"}
              </Button>
            </div>
          </CardContent>
        </Card>

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
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={resource.file_url} download>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(resource.id, resource.title)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
