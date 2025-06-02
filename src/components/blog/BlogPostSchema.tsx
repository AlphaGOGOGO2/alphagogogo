
import { BlogPost } from "@/types/blog";

interface BlogPostSchemaProps {
  post: BlogPost;
  url: string;
}

export function BlogPostSchema({ post, url }: BlogPostSchemaProps) {
  // 공식 도메인 설정
  const SITE_DOMAIN = 'https://alphagogogo.com';
  
  // 전체 URL 생성 - 항상 일관된 도메인 사용
  const fullUrl = url.startsWith('http') 
    ? url 
    : `${SITE_DOMAIN}${url.startsWith('/') ? '' : '/'}${url}`;
  
  // 포스트 URL 확인 - slug 또는 id 기반 URL 정규화
  const canonicalUrl = post.slug 
    ? `${SITE_DOMAIN}/blog/${post.slug}` 
    : `${SITE_DOMAIN}/blog/post/${post.id}`;
  
  // 태그에서 키워드 배열 생성 또는 기본 키워드 사용
  const keywordsArray = post.tags && post.tags.length > 0 
    ? [...post.tags, "알파고고고", "알파고", "알파GOGOGO", "블로그", "AI", "인공지능"] 
    : ["알파고고고", "알파고", "알파GOGOGO", "유튜브 알파GOGOGO", "유튜브 알파고고고", "본질을 찾아서", "블로그", "블로그 자동화", "알파블로그", "블로그 GPTS", "챗GPT", "블로그 AI", "블로그 GPT"];
  
  // 날짜 형식 정확히 지정
  const publishDate = new Date(post.publishedAt).toISOString();
  const modifiedDate = post.updatedAt 
    ? new Date(post.updatedAt).toISOString() 
    : publishDate;
  
  // 구조화 데이터 객체 생성 - headline과 name 우선순위 명확화
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "name": post.title,
    "alternateName": post.title,
    "description": post.excerpt,
    "about": {
      "@type": "Thing",
      "name": post.category,
      "description": `${post.category} 카테고리의 블로그 포스트`
    },
    "articleSection": post.category,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "url": `${SITE_DOMAIN}/author/${encodeURIComponent(post.author.name.toLowerCase().replace(/\s+/g, '-'))}`,
      "sameAs": ["https://alphagogogo.com"]
    },
    "publisher": {
      "@type": "Organization",
      "name": "알파고고고",
      "alternateName": "알파고고고",
      "url": SITE_DOMAIN,
      "logo": {
        "@type": "ImageObject",
        "url": "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png",
        "width": 112,
        "height": 112
      },
      "sameAs": [
        "https://alphagogogo.com",
        "https://www.youtube.com/@alphagogogo"
      ]
    },
    "datePublished": publishDate,
    "dateModified": modifiedDate,
    "dateCreated": publishDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl,
      "url": canonicalUrl,
      "name": post.title
    },
    "keywords": keywordsArray.join(","),
    "articleBody": post.content,
    "wordCount": post.content.length,
    "timeRequired": `PT${post.readTime}M`,
    "inLanguage": "ko-KR",
    "url": canonicalUrl,
    "isPartOf": {
      "@type": "Blog",
      "name": "알파고고고 블로그",
      "url": `${SITE_DOMAIN}/blog`
    }
  };

  // 이미지 추가 - 포스트 커버 이미지 또는 기본 OG 이미지 사용
  if (post.coverImage) {
    structuredData["image"] = {
      "@type": "ImageObject",
      "url": post.coverImage,
      "width": 1200,
      "height": 630,
      "caption": post.title
    };
  } else {
    structuredData["image"] = {
      "@type": "ImageObject",
      "url": "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//og%20image.png",
      "width": 1200,
      "height": 630,
      "caption": "알파고고고 - 최신 AI 소식 & 인사이트"
    };
  }

  // JSON 유효성 검사 및 변환
  try {
    // 문자열로 변환 - 순환 참조 처리를 위해 replacer 함수 사용
    const jsonString = JSON.stringify(structuredData, (key, value) => {
      // 문자열 값의 특수 문자 확인 및 처리
      if (typeof value === 'string') {
        // JSON을 손상시킬 수 있는 이스케이프되지 않은 따옴표나 제어 문자 대체
        return value.replace(/\\(?!["\\/bfnrt])/g, '\\\\');
      }
      return value;
    }, 2); // 포맷팅을 위해 들여쓰기 2 사용
    
    // 유효성 검증
    JSON.parse(jsonString);
    
    // 구조화 데이터를 script 태그로 반환
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonString }}
      />
    );
  } catch (error) {
    console.error("구조화 데이터 JSON 오류:", error);
    // 오류 시 빈 프래그먼트 반환하여 렌더링 오류 방지
    return <></>;
  }
}
