
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
        // Get only the 3 most recent posts
        setFeaturedPosts(posts.slice(0, 3));
      } catch (error) {
        console.error("Error fetching featured posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  return (
    <section id="featured-posts" className="py-20 px-6 md:px-8 bg-white relative">
      {/* Section separator - top wavy line */}
      <div className="absolute top-0 left-0 right-0 h-12 overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-16 text-[#1E293B] fill-current">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
      
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
            {[1, 2, 3].map((placeholder) => (
              <div key={placeholder} className="h-96 bg-gray-100 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : featuredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                      src={post.coverImage || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWklMjBhcnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"} 
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
                      {post.excerpt}
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
      
      {/* Section separator - bottom wavy line */}
      <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden transform rotate-180">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-16 text-white fill-current">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
    </section>
  );
}
