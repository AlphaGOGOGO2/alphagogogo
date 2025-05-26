
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Resource, ResourceCategory } from "@/types/resources";
import { resourceService } from "@/services/resourceService";
import { toast } from "sonner";
import { Upload, X, FileText, Image, Video, Music, Archive, File } from "lucide-react";

interface AdminResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource | null;
  categories: ResourceCategory[];
}

const fileTypeIcons = {
  document: FileText,
  image: Image,
  video: Video,
  audio: Music,
  archive: Archive,
  other: File
};

export function AdminResourceModal({ isOpen, onClose, resource, categories }: AdminResourceModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    file_url: "",
    file_type: "document",
    file_size: 0,
    tags: [] as string[],
    is_featured: false,
    author_name: "알파GOGOGO"
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
        is_featured: resource.is_featured,
        author_name: resource.author_name
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
        is_featured: false,
        author_name: "알파GOGOGO"
      });
      setTagsInput("");
    }
  }, [resource, categories, isOpen]);

  const saveResourceMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const tags = tagsInput
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const resourceData = {
        ...data,
        tags
      };

      if (resource) {
        return await resourceService.updateResource(resource.id, resourceData);
      } else {
        return await resourceService.createResource(resourceData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resources'] });
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['featured-resources'] });
      toast.success(resource ? "자료가 수정되었습니다." : "자료가 추가되었습니다.");
      onClose();
    },
    onError: (error) => {
      console.error("Save error:", error);
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

    saveResourceMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !tagsInput.includes(tag)) {
      setTagsInput(prev => prev ? `${prev}, ${tag}` : tag);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const tags = tagsInput.split(",").map(t => t.trim()).filter(t => t !== tagToRemove);
    setTagsInput(tags.join(", "));
  };

  const FileTypeIcon = fileTypeIcons[formData.file_type as keyof typeof fileTypeIcons] || File;

  const suggestedTags = ["AI", "머신러닝", "템플릿", "가이드", "튜토리얼", "도구", "프리미엄", "무료"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileTypeIcon className="w-5 h-5" />
            {resource ? "자료 수정" : "자료 추가"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 섹션 */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-medium text-gray-900">기본 정보</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">제목 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="예: AI 활용 가이드 북"
                  required
                  className="text-lg font-medium"
                />
              </div>

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
                <Label htmlFor="author_name">작성자</Label>
                <Input
                  id="author_name"
                  value={formData.author_name}
                  onChange={(e) => handleInputChange("author_name", e.target.value)}
                  placeholder="작성자명"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="자료에 대한 상세한 설명을 입력하세요..."
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          {/* 파일 정보 섹션 */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              파일 정보
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="file_type">파일 유형</Label>
                <select
                  id="file_type"
                  value={formData.file_type}
                  onChange={(e) => handleInputChange("file_type", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="document">📄 문서</option>
                  <option value="image">🖼️ 이미지</option>
                  <option value="video">🎥 비디오</option>
                  <option value="audio">🎵 오디오</option>
                  <option value="archive">📦 압축파일</option>
                  <option value="other">📎 기타</option>
                </select>
              </div>

              <div>
                <Label htmlFor="file_size">파일 크기 (bytes)</Label>
                <Input
                  id="file_size"
                  value={formData.file_size}
                  onChange={(e) => handleInputChange("file_size", parseInt(e.target.value) || 0)}
                  placeholder="예: 1048576"
                  type="number"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.file_size > 0 && `약 ${(formData.file_size / 1024 / 1024).toFixed(2)}MB`}
                </p>
              </div>
            </div>

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
          </div>

          {/* 태그 및 설정 섹션 */}
          <div className="bg-green-50 p-4 rounded-lg space-y-4">
            <h3 className="font-medium text-gray-900">태그 및 설정</h3>
            
            <div>
              <Label htmlFor="tags">태그</Label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="쉼표로 구분하여 입력하세요"
              />
              
              {/* 추천 태그 */}
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">추천 태그:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagAdd(tag)}
                      className="px-2 py-1 text-xs bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* 현재 태그 표시 */}
              {tagsInput && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">현재 태그:</p>
                  <div className="flex flex-wrap gap-2">
                    {tagsInput.split(",").map((tag, index) => {
                      const trimmedTag = tag.trim();
                      if (!trimmedTag) return null;
                      return (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                        >
                          {trimmedTag}
                          <button
                            type="button"
                            onClick={() => removeTag(trimmedTag)}
                            className="hover:text-purple-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
              />
              <div>
                <Label htmlFor="is_featured" className="text-sm font-medium">추천 자료로 설정</Label>
                <p className="text-xs text-gray-500">메인 페이지에 우선적으로 표시됩니다</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button 
              type="submit" 
              disabled={saveResourceMutation.isPending}
              className="min-w-[100px]"
            >
              {saveResourceMutation.isPending ? "저장 중..." : (resource ? "수정 완료" : "자료 추가")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
