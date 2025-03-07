
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "blog";
  structuredData?: Record<string, any>;
}

export function SEO({
  title = "알파블로그 - 최신 AI 소식 & 인사이트",
  description = "최신 AI 뉴스, 연구 및 인사이트로 업데이트하세요. 알파블로그는 인공지능 발전에 대한 최신 정보를 제공합니다.",
  canonicalUrl,
  ogImage = "/og-image.png",
  ogType = "website",
  structuredData,
}: SEOProps) {
  // Create the full title with branding
  const fullTitle = title.includes("알파블로그") ? title : `${title} | 알파블로그`;
  
  // Determine canonical URL
  const canonical = canonicalUrl || window.location.href;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
