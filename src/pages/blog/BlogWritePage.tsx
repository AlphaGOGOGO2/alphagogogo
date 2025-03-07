
import { useState, FormEvent } from "react";
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getAllBlogCategories, createBlogPost } from "@/services/blogService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function BlogWritePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: getAllBlogCategories
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Form validation
    if (!title || !content || !category) {
      toast.error("제목, 내용, 카테고리는 필수입력 항목입니다");
      return;
    }

    setIsSubmitting(true);

    try {
      // Extract first image URL from content if any
      const coverImageUrl = extractFirstImageUrl(content);
      
      // Create the blog post
      const newPost = await createBlogPost({
        title,
        content,
        category,
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

  // Extract the first image URL from HTML content
  const extractFirstImageUrl = (htmlContent: string): string | null => {
    const imgRegex = /<img[^>]+src="([^">]+)"/i;
    const match = htmlContent.match(imgRegex);
    return match ? match[1] : null;
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
            <Label htmlFor="content">내용</Label>
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
