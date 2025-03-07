
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { getBlogPostBySlug } from "@/services/blogService";
import { Loader2, Calendar, Clock, User, Pencil } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  
  const handleEdit = () => {
    if (post) {
      navigate(`/blog/edit/${post.slug}`, { state: { post } });
    }
  };
  
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
          <div className="flex justify-between items-center mb-6">
            <span className="inline-block px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full">
              {post.category}
            </span>
            <Button 
              onClick={handleEdit} 
              variant="outline" 
              className="flex items-center gap-2 text-purple-600 border-purple-600 hover:bg-purple-50"
            >
              <Pencil size={16} />
              수정하기
            </Button>
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
          
          {/* Display tags if available */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-medium text-gray-800 mb-3">태그</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-purple-100 text-purple-600 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </BlogLayout>
  );
}
