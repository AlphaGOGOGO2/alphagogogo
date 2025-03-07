
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { getBlogPostBySlug } from "@/services/blogService";
import { Loader2, Calendar, Clock, User } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Fetch the blog post by slug
  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => getBlogPostBySlug(slug!),
    enabled: !!slug
  });
  
  // If post not found, navigate back to blog
  useEffect(() => {
    if (!isLoading && !post && error) {
      console.error("Blog post not found:", error);
      navigate("/blog");
    }
  }, [isLoading, post, error, navigate]);
  
  if (isLoading) {
    return (
      <BlogLayout title="블로그 글 로딩중...">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
        </div>
      </BlogLayout>
    );
  }
  
  if (!post) {
    return (
      <BlogLayout title="글을 찾을 수 없습니다">
        <div className="text-center py-20">
          <h3 className="text-xl font-medium text-gray-700">요청하신 블로그 글을 찾을 수 없습니다</h3>
        </div>
      </BlogLayout>
    );
  }
  
  return (
    <BlogLayout title={post.title}>
      <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
        {post.coverImage && (
          <div className="w-full h-80 overflow-hidden">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8 pb-6 border-b">
            <div className="flex items-center">
              <User size={16} className="mr-2" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-2" />
              <span>{post.readTime}분 소요</span>
            </div>
          </div>
          
          <div className="prose prose-purple max-w-none">
            {/* Render the content safely */}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
