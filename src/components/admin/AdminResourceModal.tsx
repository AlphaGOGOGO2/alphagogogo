
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
import { Upload, X, FileText, Image, Video, Music, Archive, File, Plus } from "lucide-react";

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
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileTypeIcon className="w-6 h-6 text-purple-600" />
            {resource ? "자료 수정" : "자료 추가"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* 상단 메타 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
              <div>
                <Label htmlFor="category" className="text-sm font-semibold text-gray-700">카테고리 *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                <Label htmlFor="file_type" className="text-sm font-semibold text-gray-700">파일 유형</Label>
                <select
                  id="file_type"
                  value={formData.file_type}
                  onChange={(e) => handleInputChange("file_type", e.target.value)}
                  className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                <Label htmlFor="author_name" className="text-sm font-semibold text-gray-700">작성자</Label>
                <Input
                  id="author_name"
                  value={formData.author_name}
                  onChange={(e) => handleInputChange("author_name", e.target.value)}
                  placeholder="작성자명"
                  className="mt-2 px-4 py-3 border-gray-200 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 제목 */}
            <div>
              <Label htmlFor="title" className="text-lg font-semibold text-gray-800 mb-3 block">제목 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="자료의 제목을 입력하세요..."
                required
                className="text-xl px-4 py-4 border-gray-200 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* 설명 */}
            <div>
              <Label htmlFor="description" className="text-lg font-semibold text-gray-800 mb-3 block">설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="자료에 대한 상세한 설명을 입력하세요..."
                rows={6}
                className="resize-none px-4 py-4 text-base leading-relaxed border-gray-200 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <p className="text-sm text-gray-500 mt-2">사용자가 자료를 이해할 수 있도록 상세히 작성해주세요.</p>
            </div>

            {/* 파일 정보 */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                파일 정보
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="file_url" className="text-sm font-semibold text-gray-700">파일 URL</Label>
                  <Input
                    id="file_url"
                    value={formData.file_url}
                    onChange={(e) => handleInputChange("file_url", e.target.value)}
                    placeholder="https://example.com/file.pdf"
                    type="url"
                    className="mt-2 px-4 py-3 border-gray-200 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <Label htmlFor="file_size" className="text-sm font-semibold text-gray-700">파일 크기 (bytes)</Label>
                  <Input
                    id="file_size"
                    value={formData.file_size}
                    onChange={(e) => handleInputChange("file_size", parseInt(e.target.value) || 0)}
                    placeholder="예: 1048576"
                    type="number"
                    min="0"
                    className="mt-2 px-4 py-3 border-gray-200 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formData.file_size > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      약 {(formData.file_size / 1024 / 1024).toFixed(2)}MB
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 태그 */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">태그 관리</h3>
              
              <div>
                <Label htmlFor="tags" className="text-sm font-semibold text-gray-700">태그</Label>
                <Input
                  id="tags"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="쉼표로 구분하여 입력하세요"
                  className="mt-2 px-4 py-3 border-gray-200 focus:ring-green-500 focus:border-transparent"
                />
                
                {/* 추천 태그 */}
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-3 font-medium">추천 태그:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagAdd(tag)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-white border border-green-200 rounded-full hover:bg-green-50 hover:border-green-300 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 현재 태그 표시 */}
                {tagsInput && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-3 font-medium">현재 태그:</p>
                    <div className="flex flex-wrap gap-2">
                      {tagsInput.split(",").map((tag, index) => {
                        const trimmedTag = tag.trim();
                        if (!trimmedTag) return null;
                        return (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                          >
                            {trimmedTag}
                            <button
                              type="button"
                              onClick={() => removeTag(trimmedTag)}
                              className="hover:text-purple-900 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 추천 설정 */}
            <div className="flex items-center space-x-4 p-6 bg-yellow-50 rounded-lg border border-yellow-100">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
              />
              <div>
                <Label htmlFor="is_featured" className="text-base font-semibold text-gray-800">추천 자료로 설정</Label>
                <p className="text-sm text-gray-600 mt-1">메인 페이지에 우선적으로 표시됩니다</p>
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex-shrink-0 border-t bg-gray-50 px-6 py-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="px-6">
              취소
            </Button>
            <Button 
              type="submit" 
              disabled={saveResourceMutation.isPending}
              className="min-w-[120px] bg-purple-600 hover:bg-purple-700"
            >
              {saveResourceMutation.isPending ? "저장 중..." : (resource ? "수정 완료" : "자료 추가")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
