import { Helmet } from "react-helmet-async";

const SITE_DOMAIN = 'https://alphagogogo.com';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "blog";
  structuredData?: Record<string, any>;
  keywords?: string;
  noIndex?: boolean;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export function SEO({
  title = "알파고고고 - 최신 AI 소식 & 인사이트",
  description = "AI를 이해하는 새로운 관점, 비개발자와 비전문인이 시선으로 바라보는 AI 트렌드와 인사이트를 제공합니다.",
  canonicalUrl,
  ogImage = "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//ogimage.png",
  ogType = "website",
  structuredData,
  keywords = "알파고고고,alphagogogo,AI,인공지능,AI트렌드,AI뉴스,AI소식,AI초보자,AI입문,쉬운AI,비개발자AI,AI기초,AI블로그,AI가이드,AI튜토리얼,ChatGPT,GPT-4,Gemini,Claude,생성AI,대화형AI,LLM,AI도구,AI활용,비즈니스AI,한국AI,프롬프트 엔지니어링,블로그 자동화,테크 블로그,디지털 트랜스포메이션",
  noIndex = false,
  author = "알파고고고",
  publishedTime,
  modifiedTime,
  section,
  tags = [],
}: SEOProps) {
  // 브랜딩이 포함된 전체 제목 생성 - 개선된 로직
  const fullTitle = title === "알파고고고 - 최신 AI 소식 & 인사이트" 
    ? title 
    : title.includes("알파고고고") 
      ? title 
      : `${title} | 알파고고고`;
  
  // 정규화된 URL 생성
  const normalizedCanonical = canonicalUrl 
    ? (canonicalUrl.startsWith('http') ? canonicalUrl : `${SITE_DOMAIN}${canonicalUrl.startsWith('/') ? '' : '/'}${canonicalUrl}`)
    : (typeof window !== 'undefined' ? `${SITE_DOMAIN}${window.location.pathname}` : SITE_DOMAIN);
  
  
  // 정규화된 OG 이미지 URL 생성 (단순화된 로직)
  const normalizedOgImage = ogImage?.startsWith('http') 
    ? ogImage 
    : `${SITE_DOMAIN}${ogImage?.startsWith('/') ? '' : '/'}${ogImage || 'images//ogimage.png'}`;
  
  // description 길이 최적화 (160자 이내)
  const optimizedDescription = description.length > 160 
    ? description.substring(0, 157) + '...' 
    : description;

  return (
    <Helmet>
      {/* 핵심 SEO 메타 태그 */}
      <title>{fullTitle}</title>
      <meta name="description" content={optimizedDescription} />
      <link rel="canonical" href={normalizedCanonical} />
      
      {/* 검색엔진 사이트 인증 메타 태그 */}
      <meta name="google-site-verification" content="CJ9ZtF3aqgbLnIQqZF-mZ2rF7E6XkLhP8VzSaQqJpxs" />
      <meta name="naver-site-verification" content="d181058ce6b8b7b3c86efe4a48bb678f2b735694" />
      
      {/* 검색엔진 최적화 및 성능 지표 */}
      <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      <meta name="google" content="nositelinkssearchbox" />
      <meta name="google" content="notranslate" />
      
      {/* 소셜 미디어 최적화 */}
      <meta property="fb:app_id" content="" />
      <meta name="twitter:dnt" content="on" />
      
      {/* 콘텐츠 보안 정책 힌트 */}
      <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      
      {/* 크롤링 최적화 */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <>
          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
          <meta name="bingbot" content="index, follow" />
        </>
      )}
      
      {/* 오픈 그래프 태그 */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={normalizedCanonical} />
      <meta property="og:image" content={normalizedOgImage} />
      <meta property="og:image:alt" content={`${title} - 알파고고고`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="알파고고고" />
      <meta property="og:locale" content="ko_KR" />

      {/* 트위터 카드 메타 태그 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={normalizedOgImage} />
      <meta name="twitter:image:alt" content={`${title} - 알파고고고`} />
      <meta name="twitter:site" content="@alphagogogo" />
      <meta name="twitter:creator" content="@alphagogogo" />
      
      {/* 블로그 포스트용 추가 메타 태그 */}
      {ogType === "article" && (
        <>
          <meta property="article:author" content={author} />
          <meta property="article:publisher" content="https://alphagogogo.com" />
          {section && <meta property="article:section" content={section} />}
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* 브랜드 및 사이트 정보 */}
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="publisher" content="알파고고고" />
      <meta name="copyright" content="© 2025 알파고고고. All rights reserved." />
      <meta name="generator" content="알파고고고 - AI 소식 & 인사이트" />
      <meta name="application-name" content="알파고고고" />
      <meta name="google-adsense-account" content="ca-pub-2328910037798111" />
      
      {/* 로봇 제어 - 위에서 조건부로 처리되므로 제거 */}
      
      {/* RSS 피드 및 사이트맵 링크 */}
      <link rel="alternate" type="application/rss+xml" title="알파고고고 RSS Feed" href={`${SITE_DOMAIN}/rss.xml`} />
      <link rel="sitemap" type="application/xml" title="Sitemap" href={`${SITE_DOMAIN}/sitemap.xml`} />
      
      {/* 추가 검색 최적화 */}
      <link rel="search" type="application/opensearchdescription+xml" href={`${SITE_DOMAIN}/opensearch.xml`} title="알파고고고 검색" />
      
      {/* 파비콘 및 아이콘 */}
      <link rel="icon" type="image/png" href="https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images/logo.png" />
      <link rel="apple-touch-icon" href="https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images/logo.png" />
      
      {/* 추가 아이콘 사이즈 최적화 */}
      <link rel="icon" type="image/png" sizes="32x32" href="https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images/logo.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images/logo.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images/logo.png" />
      
      {/* 위치 및 언어 최적화 */}
      <meta name="language" content="Korean" />
      <meta name="geo.region" content="KR" />
      <meta name="geo.country" content="KR" />
      <meta name="theme-color" content="#8B5CF6" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="coverage" content="worldwide" />
      <meta name="revisit-after" content="1 day" />
      
      {/* 모바일 최적화 */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="알파고고고" />
      
      {/* 보안 헤더 */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      
      {/* DNS Prefetch 및 Preconnect 최적화 */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      <link rel="dns-prefetch" href="https://plimzlmmftdbpipbnhsy.supabase.co" />
      <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://plimzlmmftdbpipbnhsy.supabase.co" crossOrigin="anonymous" />
      
      {/* 리소스 힌트 최적화 */}
      <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" as="style" />
      <link rel="preload" href={normalizedOgImage} as="image" />
      
      {/* 기본 Organization 스키마 - 홈페이지에서만 */}
      {(!canonicalUrl || canonicalUrl === 'https://alphagogogo.com' || canonicalUrl === '/') && !structuredData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "알파고고고",
            "url": "https://alphagogogo.com",
            "logo": "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images/logo.png",
            "sameAs": [
              "https://www.youtube.com/@alphagogogo",
              "https://twitter.com/alphagogogo"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer support",
              "url": "https://alphagogogo.com/business-inquiry"
            }
          }, null, 0)}
        </script>
      )}
      
      {/* 사용자 지정 구조화 데이터 */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData, null, 0)}
        </script>
      )}
    </Helmet>
  );
}
