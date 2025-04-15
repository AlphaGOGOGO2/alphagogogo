
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { getAllBlogCategories, getAllBlogPosts } from "@/services/blogService";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [newCategory, setNewCategory] = useState("");
  
  // 카테고리 데이터 가져오기
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: getAllBlogCategories
  });
  
  // 블로그 포스트 데이터 가져오기
  const { data: posts = [] } = useQuery({
    queryKey: ["all-blog-posts"],
    queryFn: getAllBlogPosts
  });
  
  // 각 카테고리별 블로그 포스트 수 계산
  const categoryPostCounts = posts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // 현재는 실제 기능은 구현하지 않고 UI만 표시합니다.
  // 추후에 실제 카테고리 추가/삭제 기능을 구현할 수 있습니다.
  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error("카테고리 이름을 입력해주세요.");
      return;
    }
    
    // 현재는 실제로 추가하지 않고 성공 메시지만 표시합니다.
    toast.success(`새 카테고리 "${newCategory}"가 추가되었습니다.`);
    setNewCategory("");
  };
  
  return (
    <AdminLayout title="카테고리 관리">
      <SEO 
        title="카테고리 관리 | 관리자 대시보드" 
        description="블로그 카테고리 관리" 
      />
      
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">새 카테고리 추가</h2>
        <div className="flex gap-2">
          <Input
            placeholder="카테고리 이름"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="max-w-md"
          />
          <Button onClick={handleAddCategory}>추가</Button>
        </div>
      </div>
      
      <h2 className="text-lg font-medium mb-4">카테고리 목록</h2>
      
      {categoriesLoading ? (
        <div className="text-center py-10">데이터를 불러오는 중...</div>
      ) : categories.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{category.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      포스트: {categoryPostCounts[category.name] || 0}개
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast.info(`"${category.name}" 카테고리 관리 기능은 아직 구현되지 않았습니다.`)}
                  >
                    관리
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">등록된 카테고리가 없습니다.</div>
      )}
    </AdminLayout>
  );
}
