
import { useState } from "react";
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { useQuery } from "@tanstack/react-query";
import { getAllBlogCategories, createBlogPost } from "@/services/blogService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BlogForm } from "@/components/blog/BlogForm";
import { BlogPreview } from "@/components/blog/BlogPreview";

export default function BlogWritePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: getAllBlogCategories
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Form validation
    if (!title || !content || !category) {
      toast.error("제목, 내용, 카테고리는 필수입력 항목입니다");
      return;
    }

    setIsSubmitting(true);

    try {
      // Add console logs to help debug
      console.log("Attempting to create blog post:", { title, content, category, tags });
      
      // Create the blog post
      const newPost = await createBlogPost({
        title,
        content,
        category,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "")
      });
      
      if (newPost) {
        console.log("Post created successfully:", newPost);
        toast.success("블로그 포스트가 성공적으로 저장되었습니다");
        navigate(`/blog`);
      } else {
        console.error("Blog post creation returned null or undefined");
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
