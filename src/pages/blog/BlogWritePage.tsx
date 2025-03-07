
import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getAllBlogCategories, createBlogPost, uploadBlogImage } from "@/services/blogService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

export default function BlogWritePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [readTime, setReadTime] = useState(5);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: getAllBlogCategories
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Form validation
    if (!title || !content || !category) {
      toast.error("제목, 내용, 카테고리는 필수입력 항목입니다");
      return;
    }

    setIsSubmitting(true);

    try {
      let coverImageUrl = null;
      
      // If there's an image, upload it first
      if (coverImage) {
        coverImageUrl = await uploadBlogImage(coverImage);
        if (!coverImageUrl) {
          throw new Error("이미지 업로드에 실패했습니다");
        }
      }
      
      // Create the blog post
      const newPost = await createBlogPost({
        title,
        excerpt: excerpt || null,
        content,
        category,
        read_time: readTime,
        cover_image: coverImageUrl
      });
      
      if (newPost) {
        navigate(`/blog`);
      } else {
        throw new Error("블로그 포스트 작성에 실패했습니다");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("블로그 포스트 작성에 실패했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BlogLayout title="글쓰기">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="제목을 입력하세요" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="excerpt">요약 (선택)</Label>
            <Textarea 
              id="excerpt" 
              value={excerpt} 
              onChange={(e) => setExcerpt(e.target.value)} 
              placeholder="글의 요약을 입력하세요 (선택사항)" 
              rows={3} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea 
              id="content" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder="내용을 입력하세요" 
              rows={15} 
              required 
            />
            <p className="text-sm text-gray-500">HTML 형식으로 작성 가능합니다.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              {isCategoriesLoading ? (
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 로딩 중..." />
                  </SelectTrigger>
                </Select>
              ) : (
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="readTime">예상 읽기 시간 (분)</Label>
              <Input 
                id="readTime" 
                type="number" 
                value={readTime} 
                onChange={(e) => setReadTime(Number(e.target.value))} 
                min={1} 
                required 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>커버 이미지</Label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer" onClick={triggerFileInput}>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
              
              {coverImagePreview ? (
                <div className="w-full space-y-2">
                  <img 
                    src={coverImagePreview} 
                    alt="Cover preview" 
                    className="w-full h-48 object-cover rounded-lg" 
                  />
                  <p className="text-sm text-center text-gray-500">이미지를 변경하려면 클릭하세요</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-500">이미지를 업로드하려면 클릭하세요</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF 파일 지원</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-purple-600 hover:bg-purple-700" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                저장 중...
              </>
            ) : "글 저장하기"}
          </Button>
        </div>
      </form>
    </BlogLayout>
  );
}
