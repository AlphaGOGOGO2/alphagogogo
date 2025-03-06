import { useState } from "react";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Post {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
}

const featuredPosts: Post[] = [
  {
    id: 1,
    title: "생성형 AI가 창작 산업을 어떻게 변화시키고 있는가",
    excerpt: "AI 도구가 디자인, 콘텐츠 제작 및 예술적 표현을 혁신하는 방식에 대한 탐구.",
    category: "기술",
    readTime: "5분",
    date: "2023년 5월 28일",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWklMjBhcnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 2,
    title: "고급 AI의 윤리: 미래 탐색하기",
    excerpt: "AI 시스템이 더 강력해짐에 따라 필요한 윤리적 고려사항과 프레임워크에 대한 논의.",
    category: "윤리",
    readTime: "8분",
    date: "2023년 5월 22일",
    image: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGFpJTIwcm9ib3R8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 3,
    title: "의료분야의 AI: 혁신적인 진단 도구",
    excerpt: "머신러닝 모델이 의료 전문 분야 전반에 걸쳐 진단 정확도와 환자 치료를 향상시키는 방법.",
    category: "의료",
    readTime: "6분",
    date: "2023년 5월 15일",
    image: "https://images.unsplash.com/photo-1576670159052-9ea5550ca474?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGhlYWx0aGNhcmUlMjB0ZWNofGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
  }
];

export function FeaturedPosts() {
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);
  
  return (
    <section id="featured-posts" className="py-20 px-6 md:px-8 bg-gradient-to-b from-white to-purple-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-white bg-purple-600 rounded-full shadow-md">
            주요 콘텐츠
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-purple-800">
            AI 뉴스 최신 소식
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-balance">
            전 세계의 인공지능 관련 트렌드 토픽과 획기적인 개발 사항을 발견하세요.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPosts.map((post) => (
            <article 
              key={post.id}
              className={cn(
                "group rounded-2xl overflow-hidden bg-white transition-all duration-300 h-full flex flex-col",
                "border border-transparent hover:border-purple-300 shadow-lg hover:shadow-xl hover:shadow-purple-200/50",
                "transform hover:-translate-y-2"
              )}
              onMouseEnter={() => setHoveredPost(post.id)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              <div className="relative overflow-hidden h-56">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-medium rounded-full shadow-md">
                  {post.category}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-white to-purple-50/30">
                <div className="flex items-center text-sm text-gray-500 mb-3 gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-purple-500" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-purple-500" />
                    <span>{post.readTime} 소요</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3 transition-colors group-hover:text-purple-700 text-balance">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 flex-1 text-balance">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto">
                  <button 
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
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium hover:shadow-lg hover:shadow-purple-200/50 transition-all transform hover:-translate-y-0.5">
            모든 기사 보기
          </button>
        </div>
      </div>
    </section>
  );
}
