
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { getBlogPostBySlug } from "@/services/blogPostService";
import { Loader2, Calendar, Clock, User, Pencil } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BlogPasswordModal } from "@/components/blog/BlogPasswordModal";
import { SEO } from "@/components/SEO";
import { BlogPostSchema } from "@/components/blog/BlogPostSchema";
import { generateExcerpt } from "@/utils/blogUtils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // 현재 시간을 쿼리 키에 포함시켜 캐시 문제 해결
  const timestamp = Date.now();
  
  // 쿼리 구성 개선
  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug, timestamp], // 타임스탬프를 키에 추가해 캐싱 문제 방지
    queryFn: () => {
      if (!slug) return null;
      console.log(`[블로그페이지] "${slug}" 글 데이터 요청 시작 (타임스탬프: ${timestamp})`);
      return getBlogPostBySlug(slug);
    },
    staleTime: 0,      // 항상 최신 데이터 사용
    gcTime: 1000 * 60, // 1분간 가비지 컬렉션 방지
    retry: 1,          // 한 번만 재시도
    enabled: !!slug,
    refetchOnWindowFocus: false
  });
  
  useEffect(() => {
    if (!isLoading) {
      if (error) {
        console.error(`[블로그페이지] "${slug}" 글 로드 오류:`, error);
        toast.error("블로그 글을 불러오는 중 오류가 발생했습니다.");
      } else if (!post) {
        console.log(`[블로그페이지] "${slug}" 글을 찾을 수 없음.`);
      } else {
        console.log(`[블로그페이지] "${slug}" 글 로드 완료.`);
      }
    }
  }, [isLoading, post, error, slug]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleEdit = () => {
    const isAuthorized = sessionStorage.getItem("blogAuthToken") === "authorized";
    
    if (isAuthorized && post) {
      navigate(`/blog/edit/${post.slug}`, { state: { post } });
    } else {
      setShowAuthModal(true);
    }
  };
  
  if (isLoading) {
    return (
      <BlogLayout title="블로그 글 로딩중...">
        <SEO title="블로그 글 로딩중..." />
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <Loader2 className="h-10 w-10 text-purple-600 animate-spin mx-auto mb-3" />
            <p className="text-gray-600">글을 불러오는 중입니다...</p>
          </div>
        </div>
      </BlogLayout>
    );
  }
  
  if (!post) {
    return (
      <BlogLayout title="글을 찾을 수 없습니다">
        <SEO title="글을 찾을 수 없습니다" />
        <div className="text-center py-20">
          <h3 className="text-xl font-medium text-gray-700">요청하신 블로그 글을 찾을 수 없습니다</h3>
          <p className="mt-4 text-gray-600">
            해당 글이 존재하지 않거나 아직 발행되지 않은 글입니다.
          </p>
          <Button 
            onClick={() => navigate('/blog')} 
            className="mt-6 bg-purple-600 hover:bg-purple-700"
          >
            전체 글 목록으로 돌아가기
          </Button>
        </div>
      </BlogLayout>
    );
  }
  
  const postUrl = `https://alphablog.app/blog/${post.slug}`;
  const excerpt = post.excerpt || generateExcerpt(post.content);
  const postKeywords = post.tags && post.tags.length > 0
    ? `${post.tags.join(',')},알파고고고,알파고,알파GOGOGO,블로그,인공지능,AI`
    : "알파고고고,알파고,알파GOGOGO,유튜브 알파GOGOGO,유튜브 알파고고고,본질을 찾아서,블로그,인공지능,AI";
  
  return (
    <BlogLayout title={post.title}>
      <SEO 
        title={post.title}
        description={post.excerpt || generateExcerpt(post.content)}
        canonicalUrl={`https://alphablog.app/blog/${post.slug}`}
        ogImage={post.coverImage || "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png"}
        ogType="article"
        keywords={postKeywords}
      />
      <BlogPostSchema post={post} url={`https://alphablog.app/blog/${post.slug}`} />
      
      <article className={`max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {post.coverImage && (
          <div className="w-full h-80 overflow-hidden">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* 본문 내용 부분 */}
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
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => (
                  <h1 className="mt-8 mb-4 text-3xl font-bold text-purple-900 border-b-2 border-purple-300 pb-1" {...props} />
                ),
                h2: ({node, ...props}) => (
                  <h2
                    className="mt-7 mb-3 text-2xl font-semibold text-purple-800 border-l-4 border-purple-400 pl-4"
                    {...props}
                  />
                ),
                h3: ({node, ...props}) => <h3 className="mt-6 mb-2 text-xl font-semibold text-purple-700" {...props} />,
                h4: ({node, ...props}) => <h4 className="mt-5 mb-2 text-lg font-semibold text-purple-600" {...props} />,
                h5: ({node, ...props}) => <h5 className="mt-4 mb-2 text-base font-semibold text-purple-500" {...props} />,
                h6: ({node, ...props}) => <h6 className="mt-3 mb-2 text-base font-semibold text-purple-400" {...props} />,
                p: ({node, ...props}) => <p className="my-3 text-gray-800" {...props} />,
                a: ({node, ...props}) => <a className="text-purple-600 underline hover:text-purple-800 transition" target="_blank" rel="noopener noreferrer" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 my-3" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-3" {...props} />,
                li: ({node, ...props}) => <li className="my-1" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-purple-300 pl-4 italic text-gray-600 bg-purple-50 py-2 rounded" {...props} />,
                code: (props: { inline?: boolean } & React.HTMLAttributes<HTMLElement>) => {
                  const { inline, ...restProps } = props;
                  return inline
                    ? <code className="bg-purple-50 px-1 rounded text-purple-700 text-[0.98em]" {...restProps} />
                    : <pre className="bg-gray-900 text-gray-100 rounded p-4 my-4 overflow-x-auto"><code {...restProps} /></pre>;
                },
                table: ({node, ...props}) => <table className="w-full border-t border-purple-200 my-4" {...props} />,
                th: ({node, ...props}) => <th className="bg-purple-50 text-purple-700 px-4 py-2 font-medium border-b border-purple-200" {...props} />,
                td: ({node, ...props}) => <td className="px-4 py-2 border-b border-purple-100" {...props} />,
                img: ({node, ...props}) => <img className="rounded-lg my-4 max-w-full mx-auto shadow-md border border-purple-100" {...props} />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
          
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
      
      <BlogPasswordModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </BlogLayout>
  );
}
