import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllBlogCategories } from "@/services/blogService";
import { secureCreateBlogPost, secureUpdateBlogPost } from "@/services/blogSecureService";
import { toast } from "sonner";
import { BlogForm } from "@/components/blog/BlogForm";
import { BlogPreview } from "@/components/blog/BlogPreview";
import { BlogPost } from "@/types/blog";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface BlogWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  postToEdit?: BlogPost | null;
}

export function BlogWriteModal({ isOpen, onClose, postToEdit }: BlogWriteModalProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!postToEdit;
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 예약발행 관련 상태
  const [scheduled, setScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [scheduledTime, setScheduledTime] = useState<string>("12:00");

  // Fetch categories
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: getAllBlogCategories
  });

  // Load post data if in edit mode
  useEffect(() => {
    if (isEditMode && postToEdit) {
      setTitle(postToEdit.title);
      setContent(postToEdit.content);
      setCategory(postToEdit.category);
      
      // 수정 모드일 때 기존 발행 일정이 미래라면 예약발행 상태로 설정
      const publishDate = new Date(postToEdit.publishedAt);
      const now = new Date();
      if (publishDate > now) {
        setScheduled(true);
        setScheduledDate(publishDate);
        setScheduledTime(format(publishDate, "HH:mm"));
      }
    } else {
      // Reset form when creating new post
      setTitle("");
      setContent("");
      setCategory("");
      setTags("");
      setScheduled(false);
      setScheduledDate(null);
      setScheduledTime("12:00");
    }
  }, [isEditMode, postToEdit, isOpen]);

  // 예약발행 시간 계산
  const getScheduledAt = () => {
    if (!scheduled || !scheduledDate) return null;
    
    const [hours, minutes] = scheduledTime.split(":").map(Number);
    const date = new Date(scheduledDate);
    date.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    if (date <= now) {
      return null;
    }
    
    return date.toISOString();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !content || !category) {
      toast.error("제목, 내용, 카테고리는 필수입력 항목입니다");
      return;
    }

    // 예약발행 설정되었다면 validate
    if (scheduled) {
      if (!scheduledDate || !scheduledTime) {
        toast.error("예약 날짜와 시간을 모두 선택해주세요");
        return;
      }
      
      const scheduledAt = getScheduledAt();
      if (!scheduledAt) {
        toast.error("예약 발행 시간은 현재 시각 이후여야 합니다.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const parsedTags = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== "");
      
      let result;
      const scheduledAt = getScheduledAt();
      
      if (isEditMode && postToEdit) {
        result = await secureUpdateBlogPost(postToEdit.id, {
          title,
          content,
          category,
          tags: parsedTags,
          published_at: scheduledAt
        });
      } else {
        result = await secureCreateBlogPost({
          title,
          content,
          category,
          tags: parsedTags,
          published_at: scheduledAt
        });
      }
      
      if (result) {
        // 포스트 목록 새로고침
        queryClient.invalidateQueries({ queryKey: ["all-blog-posts-admin"] });
        onClose();
      }
    } catch (error) {
      toast.error(`블로그 포스트 ${isEditMode ? '수정' : '작성'}에 실패했습니다: ${error.message || '알 수 없는 오류'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] max-h-[95vh] p-0">
        <DialogTitle className="sr-only">
          {isEditMode ? "글 수정" : "새 포스트 작성"}
        </DialogTitle>
        <div className="flex flex-col lg:flex-row h-full">
          <div className="w-full lg:w-1/2 h-full">
            <BlogForm
              title={title}
              setTitle={setTitle}
              content={content}
              setContent={setContent}
              category={category}
              setCategory={setCategory}
              tags={tags}
              setTags={setTags}
              categories={categories}
              isCategoriesLoading={isCategoriesLoading}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              isEditMode={isEditMode}
              scheduled={scheduled}
              setScheduled={setScheduled}
              scheduledDate={scheduledDate}
              setScheduledDate={setScheduledDate}
              scheduledTime={scheduledTime}
              setScheduledTime={setScheduledTime}
            />
          </div>
          <div className="w-full lg:w-1/2 bg-gray-50 overflow-auto">
            <BlogPreview 
              title={title} 
              content={content} 
              category={category}
              tags={tags}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}