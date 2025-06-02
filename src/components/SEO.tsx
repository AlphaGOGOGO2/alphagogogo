
import { Helmet } from "react-helmet-async";

// 기본 사이트 도메인 - 모든 SEO 관련 URL에 일관되게 사용
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
  description = "최신 AI 뉴스, 연구 및 인사이트로 업데이트하세요. 알파고고고는 인공지능 발전에 대한 최신 정보를 제공합니다.",
  canonicalUrl,
  ogImage = "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//og%20image.png",
  ogType = "website",
  structuredData,
  keywords = "알파고고고,알파고,알파GOGOGO,유튜브 알파GOGOGO,유튜브 알파고고고,본질을 찾아서,블로그,블로그 자동화,알파블로그,블로그 GPTS,챗GPT,블로그 AI,블로그 GPT,챗지피티,블로그자동,블로그 글쓰기,블로그 AI글,러버블 DEV,Lovable DEV,러버블 DEV 회원가입,러버블 DEV 가격,러버블 DEV 요금제,AI 앱 개발,노코드 웹앱 만들기,AI 웹 개발,러버블 DEV 사용법,AI 앱 만들기,노코드 앱 제작,URL 단축,무료 URL 단축,유튜브 자막,유튜브 자막 다운로드,블로그 버튼 생성,버튼 생성기,링크 버튼 생성,링크 버튼",
  noIndex = false,
  author = "알파고고고",
  publishedTime,
  modifiedTime,
  section,
  tags = [],
}: SEOProps) {
  // 브랜딩이 포함된 전체 제목 생성
  const fullTitle = title.includes("알파고고고") ? title : `${title} | 알파고고고`;
  
  // 정규화된 URL 생성
  const normalizedCanonical = canonicalUrl 
    ? (canonicalUrl.startsWith('http') ? canonicalUrl : `${SITE_DOMAIN}${canonicalUrl.startsWith('/') ? '' : '/'}${canonicalUrl}`)
    : (typeof window !== 'undefined' ? `${SITE_DOMAIN}${window.location.pathname}` : SITE_DOMAIN);
  
  // 정규화된 OG 이미지 URL 생성
  const normalizedOgImage = ogImage.startsWith('http') ? ogImage : `${SITE_DOMAIN}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
  
  // 구조화 데이터 안전하게 문자열화
  let structuredDataString = "";
  if (structuredData) {
    try {
      structuredDataString = JSON.stringify(structuredData, null, 2);
      // 유효성 검사를 위해 다시 파싱
      JSON.parse(structuredDataString);
    } catch (error) {
      console.error("구조화 데이터 오류:", error);
      structuredDataString = ""; // 유효하지 않은 JSON은 사용하지 않음
    }
  }
  
  return (
    <Helmet>
      {/* 가장 중요한 메타 태그들을 먼저 배치 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* 오픈 그래프 태그 - 소셜 미디어 우선순위 */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
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
      <meta name="twitter:description" content={description} />
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
      
      {/* 기본 메타 태그 */}
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="google-adsense-account" content="ca-pub-2328910037798111" />
      <link rel="canonical" href={normalizedCanonical} />
      
      {/* 추가 SEO 메타 태그 */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="color-scheme" content="light dark" />
      <meta name="supported-color-schemes" content="light dark" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="target" content="all" />
      <meta name="audience" content="all" />
      <meta name="coverage" content="worldwide" />
      <meta name="classification" content="AI, Technology, Blog" />
      <meta name="subject" content="AI News and Insights" />
      <meta name="copyright" content="© 2025 알파고고고" />
      <meta name="revisit-after" content="1 day" />
      
      {/* 로봇 제어 - 색인 속도 향상 */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1, max-snippet:160" />
      )}
      
      {/* 추가 로봇 지시어 - 크롤링 최적화 */}
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow" />
      <meta name="yandex" content="index, follow" />
      <meta name="slurp" content="index, follow" />
      
      {/* RSS 피드 링크 - 정적 파일 사용 */}
      <link rel="alternate" type="application/rss+xml" title="알파고고고 RSS Feed" href={`${SITE_DOMAIN}/rss.xml`} />
      
      {/* 사이트맵 링크 - 정적 파일 사용 */}
      <link rel="sitemap" type="application/xml" title="Sitemap" href={`${SITE_DOMAIN}/sitemap.xml`} />
      
      {/* 파비콘 태그 */}
      <link rel="icon" href="https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png" />
      <link rel="apple-touch-icon" href="https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png" />
      
      {/* 추가 메타 태그 */}
      <meta name="language" content="Korean" />
      <meta name="geo.region" content="KR" />
      <meta name="geo.country" content="KR" />
      <meta name="theme-color" content="#8B5CF6" />
      <meta name="msapplication-TileColor" content="#8B5CF6" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* 모바일 최적화 */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="알파고고고" />
      
      {/* DNS Prefetch 최적화 */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      <link rel="dns-prefetch" href="https://plimzlmmftdbpipbnhsy.supabase.co" />
      <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      
      {/* Preconnect 최적화 */}
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://plimzlmmftdbpipbnhsy.supabase.co" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
      
      {/* 구조화 데이터 - 유효한 경우에만 포함 */}
      {structuredData && structuredDataString && (
        <script type="application/ld+json">
          {structuredDataString}
        </script>
      )}

      {/* Google Search Console 사이트 확인 태그 - 실제 확인 코드로 교체 필요 */}
      <meta name="google-site-verification" content="REPLACE_WITH_ACTUAL_VERIFICATION_CODE" />
      
      {/* Naver 웹마스터 도구 (한국 시장용) */}
      <meta name="naver-site-verification" content="REPLACE_WITH_NAVER_VERIFICATION_CODE" />
      
      {/* Microsoft Bing 웹마스터 도구 */}
      <meta name="msvalidate.01" content="REPLACE_WITH_BING_VERIFICATION_CODE" />
    </Helmet>
  );
}
