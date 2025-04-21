
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, Eye } from "lucide-react";
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
        // Insert Markdown at cursor position
        const textarea = textareaRef.current;
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;

          let mediaMd = '';
          if (isImage) {
            mediaMd = `![블로그 이미지](${mediaUrl})`;
          } else if (isVideo) {
            // 마크다운 기본은 비디오 태그를 지원하지 않아 html 직접 입력
            mediaMd = `<video controls src="${mediaUrl}" class="my-4 rounded-lg mx-auto max-w-full"></video>`;
          }

          const newContent = content.substring(0, start) + mediaMd + content.substring(end);
          setContent(newContent);

          setTimeout(() => {
            if (textarea) {
              const newPosition = start + mediaMd.length;
              textarea.focus();
              textarea.setSelectionRange(newPosition, newPosition);
            }
          }, 0);
        } else {
          let mediaMd = '';
          if (isImage) {
            mediaMd = `![블로그 이미지](${mediaUrl})`;
          } else if (isVideo) {
            mediaMd = `<video controls src="${mediaUrl}" class="my-4 rounded-lg mx-auto max-w-full"></video>`;
          }

          setContent(content ? `${content}\n${mediaMd}` : mediaMd);
        }

        toast.success(`${isImage ? '이미지' : '동영상'}가 업로드되었습니다`);
      }
    } catch (error) {
      console.error("미디어 업로드 실패:", error);
      toast.error("파일 업로드에 실패했습니다");
    } finally {
      setIsUploading(false);
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
        <Label htmlFor="content">내용 (마크다운 지원)</Label>
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
      <textarea
        id="content"
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={`# 마크다운으로 작성해보세요! \n\n예시: \n- ## 소제목 \n- **굵은 글씨**, *기울임* \n- [링크](https://alphagogogo.com)`}
        rows={15}
        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow text-sm p-4 bg-gray-50 resize-y transition"
        required
      />
      <p className="text-sm text-gray-500">
        <span className="text-purple-600 font-semibold">마크다운(Markdown)</span> 형식으로 작성할 수 있어요.<br />
        <span className="text-purple-700">h1/h2/ul/code/표/이미지/인용문/체크리스트</span> 등 지원하며, 이미지 첨부는 상단 버튼 이용!
      </p>
    </div>
  );
}
