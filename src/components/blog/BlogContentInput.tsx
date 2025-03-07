
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { uploadBlogImage } from "@/services/blogMediaService";
import { toast } from "sonner";

interface BlogContentInputProps {
  content: string;
  setContent: (content: string) => void;
}

export function BlogContentInput({ content, setContent }: BlogContentInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("이미지 파일만 업로드 가능합니다");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("파일 크기는 5MB 이하여야 합니다");
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadBlogImage(file);
      
      if (imageUrl) {
        // Insert image HTML at cursor position or at the end
        const imageHtml = `<img src="${imageUrl}" alt="블로그 이미지" class="my-4 rounded-lg mx-auto max-w-full" />`;
        setContent(content ? `${content}\n${imageHtml}` : imageHtml);
        toast.success("이미지가 업로드되었습니다");
      }
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      toast.error("이미지 업로드에 실패했습니다");
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="content">내용</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={triggerFileInput}
          disabled={isUploading}
          className="gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              업로드 중...
            </>
          ) : (
            <>
              <ImageIcon className="h-4 w-4" />
              이미지 업로드
            </>
          )}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
      </div>
      <Textarea 
        id="content" 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        placeholder="내용을 입력하세요" 
        rows={15} 
        required 
      />
      <p className="text-sm text-gray-500">
        HTML 형식으로 작성 가능합니다. 본문에 포함된 첫 번째 이미지가 자동으로 커버 이미지로 사용됩니다.
      </p>
    </div>
  );
}
