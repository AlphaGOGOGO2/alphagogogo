
import { BlogPost } from "@/types/blog";

interface BlogPostSchemaProps {
  post: BlogPost;
  url: string;
}

export function BlogPostSchema({ post, url }: BlogPostSchemaProps) {
  const SITE_DOMAIN = 'https://alphagogogo.com';
  
  // 포스트 URL 정규화 (더 정확한 로직)
  const canonicalUrl = post.slug 
    ? `${SITE_DOMAIN}/blog/${post.slug}` 
    : `${SITE_DOMAIN}/blog/post/${post.id}`;
  
  // 태그에서 키워드 배열 생성
  const keywordsArray = post.tags && post.tags.length > 0 
    ? [...post.tags, "알파고고고", "알파고", "알파GOGOGO", "블로그", "AI", "인공지능"] 
    : ["알파고고고", "알파고", "알파GOGOGO", "유튜브 알파GOGOGO", "유튜브 알파고고고", "본질을 찾아서", "블로그", "블로그 자동화", "알파블로그", "블로그 GPTS", "챗GPT", "블로그 AI", "블로그 GPT"];
  
  // 날짜 형식 정확히 지정
  const publishDate = new Date(post.publishedAt).toISOString();
  const modifiedDate = post.updatedAt 
    ? new Date(post.updatedAt).toISOString() 
    : publishDate;
  
  // 구조화 데이터 객체 생성
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "name": post.title,
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

  // 이미지 추가
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
    const jsonString = JSON.stringify(structuredData, null, 0);
    
    // 유효성 검증
    JSON.parse(jsonString);
    
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonString }}
        />
        {/* 브레드크럼 구조화 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "홈",
                  "item": SITE_DOMAIN
                },
                {
                  "@type": "ListItem", 
                  "position": 2,
                  "name": "블로그",
                  "item": `${SITE_DOMAIN}/blog`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": post.category,
                  "item": `${SITE_DOMAIN}/blog/${encodeURIComponent(post.category.toLowerCase().replace(/\s+/g, '-'))}`
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": post.title,
                  "item": canonicalUrl
                }
              ]
            }, null, 0)
          }}
        />
      </>
    );
  } catch (error) {
    console.error("구조화 데이터 JSON 오류:", error);
    return <></>;
  }
}
