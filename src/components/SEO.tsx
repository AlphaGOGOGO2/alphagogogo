
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "blog";
  structuredData?: Record<string, any>;
  keywords?: string;
}

export function SEO({
  title = "알파고고고 - 최신 AI 소식 & 인사이트",
  description = "최신 AI 뉴스, 연구 및 인사이트로 업데이트하세요. 알파고고고는 인공지능 발전에 대한 최신 정보를 제공합니다.",
  canonicalUrl,
  ogImage = "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png",
  ogType = "website",
  structuredData,
  keywords = "알파고고고,알파고,알파GOGOGO,유튜브 알파GOGOGO,유튜브 알파고고고,본질을 찾아서,블로그,블로그 자동화,알파블로그,블로그 GPTS,챗GPT,블로그 AI,블로그 GPT,챗지피티,블로그자동,블로그 글쓰기,블로그 AI글,러버블 DEV,Lovable DEV,러버블 DEV 회원가입,러버블 DEV 가격,러버블 DEV 요금제,AI 앱 개발,노코드 웹앱 만들기,AI 웹 개발,러버블 DEV 사용법,AI 앱 만들기,노코드 앱 제작,URL 단축,무료 URL 단축,유튜브 자막,유튜브 자막 다운로드,블로그 버튼 생성,버튼 생성기,링크 버튼 생성,링크 버튼",
}: SEOProps) {
  // Create the full title with branding
  const fullTitle = title.includes("알파고고고") ? title : `${title} | 알파고고고`;
  
  // Determine canonical URL
  const canonical = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');
  
  // Safely stringify structured data
  let structuredDataString = "";
  if (structuredData) {
    try {
      structuredDataString = JSON.stringify(structuredData);
    } catch (error) {
      console.error("Error stringifying structured data:", error);
      structuredDataString = "{}";
    }
  }
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="google-adsense-account" content="ca-pub-2328910037798111" />
      <link rel="canonical" href={canonical} />
      
      {/* RSS Feed Link */}
      <link rel="alternate" type="application/rss+xml" title="알파고고고 RSS Feed" href="https://alphagogogo.com/rss.xml" />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Favicon Tags */}
      <link rel="icon" href="https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png" />
      <link rel="apple-touch-icon" href="https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png" />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="알파고고고" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Korean" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Structured Data */}
      {structuredData && structuredDataString !== "{}" && (
        <script type="application/ld+json">
          {structuredDataString}
        </script>
      )}
    </Helmet>
  );
}
