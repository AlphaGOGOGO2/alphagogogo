
import { useState, useRef } from "react";
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { blogPosts, getPostsByCategory } from "@/data/blogPosts";
import { BlogPost } from "@/types/blog";
import { useNavigate } from "react-router-dom";
import { Image, FileText, Heading, List } from "lucide-react";

export default function BlogWritePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("최신 AI소식");
  const [coverImage, setCoverImage] = useState("");
  const [readTime, setReadTime] = useState(5);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we would upload to a storage service
      // For now, we'll use a placeholder or create an object URL
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
      toast.success("이미지가 업로드되었습니다.");
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !category || !coverImage) {
      toast.error("모든 필드를 채워주세요.");
      return;
    }
    
    // Generate a random ID and slug
    const id = (blogPosts.length + 1).toString();
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    
    // Create new blog post
    const newPost: BlogPost = {
      id,
      title,
      excerpt: excerpt || title.substring(0, 100) + "...",
      content,
      category,
      author: {
        name: "알파GOGOGO",
        avatar: "https://i.pravatar.cc/150?img=10"
      },
      publishedAt: new Date().toISOString().split('T')[0],
      readTime,
      coverImage: coverImage || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
      slug
    };
    
    // In a real app, we would send this to a database
    // For now, we'll just add it to our local array
    blogPosts.unshift(newPost);
    
    toast.success("게시물이 성공적으로 작성되었습니다!");
    navigate(`/blog`);
  };
  
  return (
    <BlogLayout title="새 글 작성하기">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              제목
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="게시물 제목을 입력하세요"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
              요약 (선택사항)
            </label>
            <Input
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="게시물의 간단한 요약을 입력하세요"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              카테고리
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="최신 AI소식">최신 AI소식</SelectItem>
                <SelectItem value="화제의 이슈">화제의 이슈</SelectItem>
                <SelectItem value="라이프스타일">라이프스타일</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="readTime" className="block text-sm font-medium text-gray-700">
              읽는 시간 (분)
            </label>
            <Input
              id="readTime"
              type="number"
              min="1"
              max="60"
              value={readTime}
              onChange={(e) => setReadTime(parseInt(e.target.value))}
              className="w-32"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
              커버 이미지
            </label>
            <div className="flex items-center space-x-4">
              <Button type="button" onClick={triggerFileInput} variant="outline" className="flex items-center gap-2">
                <Image size={18} />
                이미지 업로드
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              {coverImage && (
                <div className="relative w-24 h-24 rounded-md overflow-hidden">
                  <img src={coverImage} alt="미리보기" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              본문
            </label>
            <div className="border rounded-md p-2 bg-white">
              <div className="flex gap-2 mb-2 pb-2 border-b">
                <Button type="button" variant="outline" size="sm" className="p-2 h-8 w-8">
                  <Heading size={14} />
                </Button>
                <Button type="button" variant="outline" size="sm" className="p-2 h-8 w-8">
                  <FileText size={14} />
                </Button>
                <Button type="button" variant="outline" size="sm" className="p-2 h-8 w-8">
                  <List size={14} />
                </Button>
                <Button type="button" variant="outline" size="sm" className="p-2 h-8 w-8" onClick={triggerFileInput}>
                  <Image size={14} />
                </Button>
              </div>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="HTML 형식으로 본문을 작성하세요"
                className="w-full h-64 p-2 border rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate("/blog")}>
              취소
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
              게시하기
            </Button>
          </div>
        </form>
      </div>
    </BlogLayout>
  );
}
