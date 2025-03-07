
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      toast.error("이미지 또는 동영상 파일만 업로드 가능합니다");
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error(`파일 크기는 10MB 이하여야 합니다 (현재: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
      return;
    }

    setIsUploading(true);
    try {
      const mediaUrl = await uploadBlogImage(file);
      
      if (mediaUrl) {
        // Insert media HTML at cursor position
        const textarea = textareaRef.current;
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          
          let mediaHtml = '';
          if (isImage) {
            mediaHtml = `<img src="${mediaUrl}" alt="블로그 이미지" class="my-4 rounded-lg mx-auto max-w-full" />`;
          } else if (isVideo) {
            mediaHtml = `<video controls src="${mediaUrl}" class="my-4 rounded-lg mx-auto max-w-full"></video>`;
          }
          
          const newContent = content.substring(0, start) + mediaHtml + content.substring(end);
          setContent(newContent);
          
          // Set cursor position after the inserted media
          setTimeout(() => {
            if (textarea) {
              const newPosition = start + mediaHtml.length;
              textarea.focus();
              textarea.setSelectionRange(newPosition, newPosition);
            }
          }, 0);
        } else {
          // Fallback if textarea ref is not available
          setContent(content ? `${content}\n${mediaHtml}` : mediaHtml);
        }
        
        toast.success(`${isImage ? '이미지' : '동영상'}가 업로드되었습니다`);
      }
    } catch (error) {
      console.error("미디어 업로드 실패:", error);
      toast.error("파일 업로드에 실패했습니다");
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
              미디어 업로드
            </>
          )}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleMediaUpload}
          accept="image/*,video/*"
          className="hidden"
        />
      </div>
      <Textarea 
        id="content" 
        ref={textareaRef}
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
