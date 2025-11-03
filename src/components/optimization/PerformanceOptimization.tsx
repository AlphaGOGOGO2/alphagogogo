import { Helmet } from "react-helmet-async";
import { useEffect } from "react";

interface PerformanceOptimizationProps {
  children: React.ReactNode;
}

export function PerformanceOptimization({ children }: PerformanceOptimizationProps) {
  // 컴포넌트가 마운트될 때까지 Helmet 렌더링을 지연
  useEffect(() => {
    // DOM이 완전히 준비되었는지 확인
    if (document.readyState !== 'complete') {
      const handleLoad = () => {
        document.removeEventListener('load', handleLoad);
      };
      document.addEventListener('load', handleLoad);
    }
  }, []);

  return (
    <>
      <Helmet>
        {/* DNS 프리페치 최적화 */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="//googleads.g.doubleclick.net" />

        {/* 프리커넥트 최적화 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* 중요 리소스 프리로드 */}
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" 
          as="style" 
          onLoad={(e) => {
            const link = e.target as HTMLLinkElement;
            link.onload = null;
            link.rel = 'stylesheet';
          }}
        />
        
        {/* 커스텀 폰트 프리로드 */}
        <link 
          rel="preload" 
          href="/fonts//Paperlogy-6SemiBold.ttf" 
          as="font" 
          type="font/ttf" 
          crossOrigin=""
        />
        
        {/* 중요한 이미지 프리로드 - 블로그 최적화 */}
        <link 
          rel="preload" 
          href="/images/instructor-profile-image.png" 
          as="image" 
          type="image/png"
        />
        
        {/* LCP 개선을 위한 중요 리소스 프리페치 */}
        <link rel="prefetch" href="/blog-images/" />
        <link rel="prefetch" href="/images/" />
        
        {/* Core Web Vitals 최적화 힌트 */}
        <meta name="resource-type" content="document" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="1 days" />
        
        {/* 모바일 성능 최적화 */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* 캐시 제어 (HTML 파일) */}
        <meta httpEquiv="Cache-Control" content="public, max-age=31536000, stale-while-revalidate=86400" />
        
        {/* 보안 헤더 강화 */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), interest-cohort=()" />
        
        {/* 접근성 개선 */}
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#8B5CF6" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#7C3AED" media="(prefers-color-scheme: dark)" />
        
        {/* PWA 관련 설정 */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="알파고고고" />
        <meta name="application-name" content="알파고고고" />
        
      </Helmet>
      {children}
    </>
  );
}