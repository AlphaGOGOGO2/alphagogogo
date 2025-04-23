
import { useState, useEffect } from "react";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { getAllBlogPosts } from "@/services/blogService";
import { BlogPost } from "@/types/blog";
import { formatDate } from "@/lib/utils";

export function FeaturedPosts() {
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getAllBlogPosts();
        // Get 6 most recent posts instead of 3
        setFeaturedPosts(posts.slice(0, 6));
      } catch (error) {
        console.error("Error fetching featured posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  return (
    <section id="featured-posts" className="py-20 px-6 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-white bg-purple-600 rounded-full shadow-md">
            주요 콘텐츠
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-gray-800">
            최신 소식
          </h2>
          <p className="text-purple-700 max-w-2xl mx-auto text-balance">
            전 세계의 인공지능 관련 트렌드 토픽과 획기적인 개발 사항을 발견하세요.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((placeholder) => (
              <div key={placeholder} className="h-96 bg-gray-100 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : featuredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <Link 
                to={`/blog/${post.slug}`} 
                key={post.id}
                className="block h-full"
                onMouseEnter={() => setHoveredPost(post.id)}
                onMouseLeave={() => setHoveredPost(null)}
              >
                <article 
                  className={cn(
                    "group rounded-2xl overflow-hidden bg-white transition-all duration-300 h-full flex flex-col",
                    "border border-gray-200 hover:border-purple-300 shadow-md hover:shadow-xl hover:shadow-purple-100/50",
                    "transform hover:-translate-y-2 cursor-pointer"
                  )}
                >
                  <div className="relative overflow-hidden h-56">
                    <img 
                      src={
                        post.coverImage
                          ? post.coverImage
                          : "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWklMjBhcnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
                      } 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-full shadow-md">
                      {post.category}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center text-sm text-gray-500 mb-3 gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-purple-500" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-purple-500" />
                        <span>{post.readTime}분 소요</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 transition-colors group-hover:text-purple-700 text-balance">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 flex-1 text-balance">
                      {/* 마크다운 제거하여 출력 */}
                      {post.excerpt.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_~>#-]/g, "").replace(/\n+/g, " ")}
                    </p>
                    
                    {/* Display tags if available */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-0.5 bg-purple-50 text-purple-600 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="text-xs text-gray-500">+{post.tags.length - 2}</span>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-auto">
                      <div 
                        className={cn(
                          "flex items-center text-sm font-medium gap-1 transition-all",
                          hoveredPost === post.id ? "text-purple-700" : "text-gray-900"
                        )}
                      >
                        더 읽기
                        <ArrowRight 
                          size={16} 
                          className={cn(
                            "transition-transform duration-300",
                            hoveredPost === post.id ? "translate-x-1" : ""
                          )} 
                        />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-white rounded-lg shadow">
            <p className="text-gray-600">포스트가 없습니다. 첫 번째 블로그 포스트를 작성해보세요.</p>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Link to="/blog">
            <button className="px-8 py-3 rounded-lg bg-purple-600 text-white font-medium hover:shadow-lg hover:shadow-purple-200/50 transition-all transform hover:-translate-y-0.5">
              전체 글 확인하기
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
