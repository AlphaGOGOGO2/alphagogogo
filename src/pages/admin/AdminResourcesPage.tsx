
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Search, Download, Eye, ExternalLink } from "lucide-react";
import { resourceService } from "@/services/resourceService";
import { Resource } from "@/types/resources";
import { toast } from "sonner";
import { AdminResourceModal } from "@/components/admin/AdminResourceModal";

export default function AdminResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const queryClient = useQueryClient();

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['admin-resources'],
    queryFn: resourceService.getAllResources
  });

  const deleteResourceMutation = useMutation({
    mutationFn: resourceService.deleteResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resources'] });
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['featured-resources'] });
      toast.success("자료가 삭제되었습니다.");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("삭제 중 오류가 발생했습니다.");
    }
  });

  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery === "" || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  };

  const handleDeleteResource = (resourceId: string, resourceTitle: string) => {
    if (confirm(`정말로 "${resourceTitle}" 자료를 삭제하시겠습니까?`)) {
      deleteResourceMutation.mutate(resourceId);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingResource(null);
  };

  const handleAddNew = () => {
    setEditingResource(null);
    setIsModalOpen(true);
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "알 수 없음";
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(1)}MB`;
    return `${kb.toFixed(1)}KB`;
  };

  const getFileTypeDisplay = (fileType: string) => {
    const types = {
      document: "📄 문서",
      image: "🖼️ 이미지", 
      video: "🎥 비디오",
      audio: "🎵 오디오",
      archive: "📦 압축파일",
      other: "📎 기타"
    };
    return types[fileType as keyof typeof types] || fileType;
  };

  if (isLoading) {
    return (
      <AdminLayout title="자료실 관리">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">로딩 중...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="자료실 관리">
      <div className="space-y-6">
        {/* 상단 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전체 자료</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resources.length}</div>
              <p className="text-xs text-muted-foreground">
                활성 자료 수
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">추천 자료</CardTitle>
              <Badge variant="default" className="h-4 px-1 text-xs">추천</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resources.filter(r => r.is_featured).length}
              </div>
              <p className="text-xs text-muted-foreground">
                메인 페이지 노출
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 다운로드</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resources.reduce((sum, r) => sum + r.download_count, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                누적 다운로드 수
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 필터 및 검색 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>자료 관리</CardTitle>
              <Button 
                onClick={handleAddNew}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                자료 추가
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="제목, 설명, 태그로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* 자료 테이블 */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>제목</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead>크기</TableHead>
                    <TableHead>다운로드</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>등록일</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="font-medium max-w-[200px]">
                        <div className="truncate" title={resource.title}>
                          {resource.title}
                        </div>
                        {resource.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {resource.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {resource.tags.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{resource.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{getFileTypeDisplay(resource.file_type)}</span>
                      </TableCell>
                      <TableCell>{formatFileSize(resource.file_size)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{resource.download_count.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {resource.is_featured && (
                          <Badge variant="default">추천</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(resource.created_at).toLocaleDateString('ko-KR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {resource.file_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(resource.file_url!, '_blank')}
                              title="파일 보기"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditResource(resource)}
                            title="수정"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteResource(resource.id, resource.title)}
                            className="text-red-600 hover:text-red-700 hover:border-red-200"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredResources.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500">
                    {searchQuery ? 
                      "검색 조건에 맞는 자료가 없습니다." : 
                      "등록된 자료가 없습니다."
                    }
                  </div>
                  {!searchQuery && (
                    <Button 
                      onClick={handleAddNew}
                      variant="outline" 
                      className="mt-4"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      첫 번째 자료 추가하기
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 자료 추가/수정 모달 */}
      <AdminResourceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        resource={editingResource}
        categories={[]}
      />
    </AdminLayout>
  );
}
