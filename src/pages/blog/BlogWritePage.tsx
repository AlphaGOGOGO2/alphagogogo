
import { useState, useEffect } from "react";
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { useQuery } from "@tanstack/react-query";
import { getAllBlogCategories } from "@/services/blogService";
import { secureCreateBlogPost, secureUpdateBlogPost } from "@/services/blogSecureService";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { BlogForm } from "@/components/blog/BlogForm";
import { BlogPreview } from "@/components/blog/BlogPreview";
import { BlogPost } from "@/types/blog";
import { openInfoPopup } from "@/utils/popupUtils";
import { format } from "date-fns";

export default function BlogWritePage() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const isEditMode = location.pathname.includes('/edit/');
  const postToEdit = location.state?.post as BlogPost | undefined;
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postId, setPostId] = useState<string | null>(null);

  // 예약발행 관련 상태 추가
  const [scheduled, setScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [scheduledTime, setScheduledTime] = useState<string>("12:00");

  // Check authentication status
  useEffect(() => {
    const isAuthorized = sessionStorage.getItem("blogAuthToken") === "authorized";
    if (!isAuthorized) {
      openInfoPopup({
        title: "접근 권한 없음",
        message: "글쓰기 페이지에 접근할 권한이 없습니다. 먼저 관리자 인증을 해주세요.",
      });
      navigate("/blog");
    }
  }, [navigate]);

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
      setPostId(postToEdit.id);
      
      // 수정 모드일 때 기존 발행 일정이 미래라면 예약발행 상태로 설정
      const publishDate = new Date(postToEdit.publishedAt);
      const now = new Date();
      if (publishDate > now) {
        setScheduled(true);
        setScheduledDate(publishDate);
        setScheduledTime(
          format(publishDate, "HH:mm")
        );
      }
    }
  }, [isEditMode, postToEdit]);

  // 예약발행 시간 계산
  const getScheduledAt = () => {
    if (!scheduled || !scheduledDate) return null;
    
    // 시간(시:분) 입력값 파싱
    const [hours, minutes] = scheduledTime.split(":").map(Number);
    const date = new Date(scheduledDate);
    date.setHours(hours, minutes, 0, 0);
    
    // 현재 시간보다 이전인지 확인
    const now = new Date();
    if (date <= now) {
      return null; // 과거 시간이면 null 반환 (현재 시간으로 설정됨)
    }
    
    return date.toISOString();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !content || !category) {
      toast.error("제목, 내용, 카테고리는 필수입력 항목입니다");
      return;
    }

    // 예약발행 설정되었다면 published_at validate
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
      // Parse tags properly
      const parsedTags = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== "");
      
      let result;
      const scheduledAt = getScheduledAt();
      
      if (isEditMode && postId) {
        // Update existing post - 보안 서비스 사용
        result = await secureUpdateBlogPost(postId, {
          title,
          content,
          category,
          tags: parsedTags,
          published_at: scheduledAt // null이면 기존 시간 유지됨
        });
      } else {
        // Create new post - 보안 서비스 사용
        result = await secureCreateBlogPost({
          title,
          content,
          category,
          tags: parsedTags,
          published_at: scheduledAt // null이면 현재 시간으로 설정됨
        });
      }
      
      if (result) {
        setTimeout(() => {
          navigate(`/blog/${result.slug}`);
        }, 1000);
      }
    } catch (error) {
      toast.error(`블로그 포스트 ${isEditMode ? '수정' : '작성'}에 실패했습니다: ${error.message || '알 수 없는 오류'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BlogLayout title={isEditMode ? "글 수정" : "글쓰기"}>
      <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-250px)]">
        <div className="w-full lg:w-1/2">
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
            // 예약발행 관련 prop 전달
            scheduled={scheduled}
            setScheduled={setScheduled}
            scheduledDate={scheduledDate}
            setScheduledDate={setScheduledDate}
            scheduledTime={scheduledTime}
            setScheduledTime={setScheduledTime}
          />
        </div>
        <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-sm border border-gray-100 overflow-auto">
          <BlogPreview 
            title={title} 
            content={content} 
            category={category}
            tags={tags}
          />
        </div>
      </div>
    </BlogLayout>
  );
}
