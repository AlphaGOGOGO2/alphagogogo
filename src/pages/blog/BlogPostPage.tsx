import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BlogLayout } from "@/components/layouts/BlogLayout";
import { getBlogPostBySlug, getBlogPostById } from "@/services/blogPostService";
import { Loader2, Calendar, Clock, User, Pencil } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BlogPasswordModal } from "@/components/blog/BlogPasswordModal";
import { SEO } from "@/components/SEO";
import { BlogPostSchema } from "@/components/blog/BlogPostSchema";
import { generateExcerpt } from "@/utils/blogUtils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// 일관된 도메인 사용
const SITE_DOMAIN = 'https://alphagogogo.com';

export default function BlogPostPage() {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // 디버깅을 위한 로깅
  useEffect(() => {
    console.log("BlogPostPage 로드됨. 파라미터:", { slug, id });
  }, [slug, id]);
  
  // 쿼리 키와 함수 결정 (slug 또는 id 기반)
  const queryKey = slug ? ["blog-post", "slug", slug] : ["blog-post", "id", id];
  const queryFn = async () => {
    if (slug) {
      const post = await getBlogPostBySlug(slug);
      if (!post) {
        console.log(`[BlogPostPage] slug: ${slug}로 포스트를 찾을 수 없음`);
      }
      return post;
    } else if (id) {
      const post = await getBlogPostById(id);
      if (!post) {
        console.log(`[BlogPostPage] id: ${id}로 포스트를 찾을 수 없음`);
      }
      return post;
    }
    return null;
  };
  
  // 블로그 포스트 쿼리
  const { data: post, isLoading, error } = useQuery({
    queryKey,
    queryFn,
    staleTime: 10000, // 10초 캐시
    refetchOnWindowFocus: false,
    retry: 2
  });

  // 디버깅을 위한 로깅
  useEffect(() => {
    console.log("[BlogPostPage] 쿼리 상태 변화:", { post, isLoading, error });
  }, [post, isLoading, error]);
  
  // 에러 처리
  useEffect(() => {
    if (error) {
      console.error("블로그 포스트 로딩 중 오류:", error);
      toast.error("블로그 포스트를 불러오는 중 오류가 발생했습니다.");
    }
  }, [error]);
  
  const handleEdit = () => {
    const isAuthorized = sessionStorage.getItem("blogAuthToken") === "authorized";
    
    if (isAuthorized && post) {
      navigate(`/blog/edit/${post.slug || post.id}`, { state: { post } });
    } else {
      setShowAuthModal(true);
    }
  };
  
  if (isLoading) {
    return (
      <BlogLayout title="블로그 글 로딩중..." isLoading={true}>
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
  
  if (!post && !isLoading) {
    console.log("[BlogPostPage] 포스트를 찾을 수 없음. slug:", slug, "id:", id);
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
  
  // SEO 메타데이터 개선
  const postDescription = post.excerpt && post.excerpt.trim() !== '' 
    ? post.excerpt 
    : generateExcerpt(post.content, 160);
  
  const postKeywords = post.tags && post.tags.length > 0
    ? `${post.tags.join(',')},알파고고고,알파고,알파GOGOGO,블로그,인공지능,AI`
    : "알파고고고,알파고,알파GOGOGO,유튜브 알파GOGOGO,유튜브 알파고고고,본질을 찾아서,블로그,인공지능,AI";
  
  // 올바른 도메인으로 canonical URL 생성
  const canonicalUrl = `${SITE_DOMAIN}/blog/${post.slug || `post/${post.id}`}`;
  
  return (
    <BlogLayout title={post.title}>
      <SEO 
        title={post.title}
        description={postDescription}
        canonicalUrl={canonicalUrl}
        ogImage={post.coverImage || "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png"}
        ogType="article"
        keywords={postKeywords}
        author={post.author.name}
        publishedTime={new Date(post.publishedAt).toISOString()}
        modifiedTime={post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined}
        section={post.category}
        tags={post.tags || []}
      />
      <BlogPostSchema post={post} url={canonicalUrl} />
      
      <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
        {post.coverImage && (
          <div className="w-full h-80 overflow-hidden">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
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
              aria-label="블로그 포스트 수정하기"
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
                img: ({node, ...props}) => (
                  <img 
                    className="rounded-lg my-4 max-w-full mx-auto shadow-md border border-purple-100" 
                    loading="lazy"
                    decoding="async"
                    {...props} 
                  />
                ),
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
