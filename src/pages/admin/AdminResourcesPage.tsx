
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Search, Download } from "lucide-react";
import { resourceService } from "@/services/resourceService";
import { Resource } from "@/types/resources";
import { toast } from "sonner";
import { AdminResourceModal } from "@/components/admin/AdminResourceModal";

export default function AdminResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const queryClient = useQueryClient();

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['admin-resources'],
    queryFn: resourceService.getAllResources
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['resource-categories'],
    queryFn: resourceService.getCategories
  });

  const deleteResourceMutation = useMutation({
    mutationFn: async (resourceId: string) => {
      // 실제 삭제 로직은 추후 구현
      console.log("Delete resource:", resourceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resources'] });
      toast.success("자료가 삭제되었습니다.");
    },
    onError: () => {
      toast.error("삭제 중 오류가 발생했습니다.");
    }
  });

  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery === "" || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  };

  const handleDeleteResource = (resourceId: string) => {
    if (confirm("정말로 이 자료를 삭제하시겠습니까?")) {
      deleteResourceMutation.mutate(resourceId);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingResource(null);
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "알 수 없음";
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(1)}MB`;
    return `${kb.toFixed(1)}KB`;
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전체 자료</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resources.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">추천 자료</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resources.filter(r => r.is_featured).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 다운로드</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resources.reduce((sum, r) => sum + r.download_count, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">카테고리 수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* 필터 및 검색 */}
        <Card>
          <CardHeader>
            <CardTitle>자료 관리</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="자료 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">모든 카테고리</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                자료 추가
              </Button>
            </div>

            {/* 자료 테이블 */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>제목</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>파일 크기</TableHead>
                  <TableHead>다운로드 수</TableHead>
                  <TableHead>추천</TableHead>
                  <TableHead>등록일</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell className="font-medium">
                      {resource.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{resource.category}</Badge>
                    </TableCell>
                    <TableCell>{formatFileSize(resource.file_size)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4 text-gray-500" />
                        {resource.download_count}
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
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditResource(resource)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteResource(resource.id)}
                          className="text-red-600 hover:text-red-700"
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
                <p className="text-gray-500">등록된 자료가 없습니다.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 자료 추가/수정 모달 */}
      <AdminResourceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        resource={editingResource}
        categories={categories}
      />
    </AdminLayout>
  );
}
