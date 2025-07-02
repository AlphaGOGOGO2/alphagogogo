import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  path: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav aria-label="페이지 경로" className={`flex items-center space-x-1 text-sm ${className}`}>
      <Link
        to="/"
        className="flex items-center text-gray-500 hover:text-purple-600 transition-colors"
        aria-label="홈으로 이동"
      >
        <Home size={16} />
      </Link>
      
      {items.map((item, index) => (
        <div key={item.path} className="flex items-center">
          <ChevronRight size={14} className="text-gray-400 mx-1" />
          
          {item.current ? (
            <span className="text-gray-900 font-medium" aria-current="page">
              {item.name}
            </span>
          ) : (
            <Link
              to={item.path}
              className="text-gray-500 hover:text-purple-600 transition-colors"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

// 블로그 포스트용 브레드크럼 생성 헬퍼
export function createBlogPostBreadcrumbs(
  category: string,
  postTitle: string
): BreadcrumbItem[] {
  return [
    { name: "블로그", path: "/blog" },
    { name: category, path: `/blog/${category}` },
    { name: postTitle, path: "", current: true }
  ];
}

// 카테고리 페이지용 브레드크럼 생성 헬퍼  
export function createCategoryBreadcrumbs(categoryName: string): BreadcrumbItem[] {
  return [
    { name: "블로그", path: "/blog" },
    { name: categoryName, path: "", current: true }
  ];
}

// 자동 브레드크럼 생성 (현재 경로 기반)
export function useAutoBreadcrumbs(): BreadcrumbItem[] {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = '';
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;
    
    // 세그먼트명을 사용자 친화적으로 변환
    let displayName = segment;
    
    // 일반적인 경로명 매핑
    const pathNameMap: Record<string, string> = {
      'blog': '블로그',
      'gpts': 'GPTS',
      'resources': '자료실',
      'services': '서비스',
      'community': '커뮤니티',
      'ai-partnership': 'AI품앗이',
      'business-inquiry': '비즈니스 문의',
      'blog-button-creator': '블로그 버튼 생성기',
      'latest-updates': '최신 AI소식',
      'trending': '화제의 이슈',
      'lifestyle': '라이프스타일',
      'ai-news': 'AI 뉴스',
      'tech-reviews': '기술 리뷰',
      'tutorials': 'AI 튜토리얼',
      'chatgpt-guides': 'ChatGPT 가이드',
      'lovable-dev': 'Lovable DEV',
      'post': '포스트'
    };
    
    displayName = pathNameMap[segment] || segment;
    
    breadcrumbs.push({
      name: displayName,
      path: currentPath,
      current: isLast
    });
  });
  
  return breadcrumbs;
}