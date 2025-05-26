
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Resource, ResourceCategory } from "@/types/resources";
import { toast } from "sonner";

interface AdminResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource | null;
  categories: ResourceCategory[];
}

export function AdminResourceModal({ isOpen, onClose, resource, categories }: AdminResourceModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    file_url: "",
    file_type: "document",
    file_size: 0,
    tags: [] as string[],
    is_featured: false
  });

  const [tagsInput, setTagsInput] = useState("");

  const queryClient = useQueryClient();

  // 폼 데이터 초기화
  useEffect(() => {
    if (resource) {
      setFormData({
        title: resource.title,
        description: resource.description || "",
        category: resource.category,
        file_url: resource.file_url || "",
        file_type: resource.file_type,
        file_size: resource.file_size || 0,
        tags: resource.tags,
        is_featured: resource.is_featured
      });
      setTagsInput(resource.tags.join(", "));
    } else {
      setFormData({
        title: "",
        description: "",
        category: categories[0]?.name || "",
        file_url: "",
        file_type: "document",
        file_size: 0,
        tags: [],
        is_featured: false
      });
      setTagsInput("");
    }
  }, [resource, categories, isOpen]);

  const saveResourceMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // 실제 저장 로직은 추후 구현
      console.log("Save resource:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resources'] });
      toast.success(resource ? "자료가 수정되었습니다." : "자료가 추가되었습니다.");
      onClose();
    },
    onError: () => {
      toast.error("저장 중 오류가 발생했습니다.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }

    if (!formData.category) {
      toast.error("카테고리를 선택해주세요.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    saveResourceMutation.mutate({
      ...formData,
      tags
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {resource ? "자료 수정" : "자료 추가"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="자료 제목을 입력하세요"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="자료에 대한 설명을 입력하세요"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">카테고리 *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">카테고리 선택</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="file_type">파일 유형</Label>
              <select
                id="file_type"
                value={formData.file_type}
                onChange={(e) => handleInputChange("file_type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="document">문서</option>
                <option value="image">이미지</option>
                <option value="video">비디오</option>
                <option value="audio">오디오</option>
                <option value="archive">압축파일</option>
                <option value="other">기타</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="file_url">파일 URL</Label>
              <Input
                id="file_url"
                value={formData.file_url}
                onChange={(e) => handleInputChange("file_url", e.target.value)}
                placeholder="https://example.com/file.pdf"
                type="url"
              />
            </div>

            <div>
              <Label htmlFor="file_size">파일 크기 (bytes)</Label>
              <Input
                id="file_size"
                value={formData.file_size}
                onChange={(e) => handleInputChange("file_size", parseInt(e.target.value) || 0)}
                placeholder="파일 크기"
                type="number"
                min="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
            <Input
              id="tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="AI, 머신러닝, 템플릿"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
            />
            <Label htmlFor="is_featured">추천 자료로 설정</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button 
              type="submit" 
              disabled={saveResourceMutation.isPending}
            >
              {saveResourceMutation.isPending ? "저장 중..." : (resource ? "수정" : "추가")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
