import { useEffect } from "react";

interface CoreWebVitalsOptimizerProps {
  criticalImages?: string[];
  criticalFonts?: string[];
  preconnectDomains?: string[];
}

export function CoreWebVitalsOptimizer({ 
  criticalImages = [], 
  criticalFonts = [],
  preconnectDomains = []
}: CoreWebVitalsOptimizerProps) {
  
  useEffect(() => {
    // 중요 이미지들을 프리로드 (LCP 개선)
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.fetchPriority = 'high';
      document.head.appendChild(link);
    });

    // 중요 폰트들을 프리로드 (CLS 개선)
    criticalFonts.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = href;
      document.head.appendChild(link);
    });

    // 중요 도메인들에 프리커넥트 (FCP/LCP 개선)
    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Critical Resource Hints 추가
    const resourceHints = [
      { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' }
    ];

    resourceHints.forEach(hint => {
      if (!document.querySelector(`link[href="${hint.href}"]`)) {
        const link = document.createElement('link');
        link.rel = hint.rel;
        link.href = hint.href;
        document.head.appendChild(link);
      }
    });

  }, [criticalImages, criticalFonts, preconnectDomains]);

  // 폰트 스타일 최적화를 위한 CSS 추가
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Font Display 최적화 - CLS 방지 */
      @font-face {
        font-family: 'Inter';
        font-display: swap;
        src: url('https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2') format('woff2');
      }
      
      /* 이미지 로딩 최적화 */
      img {
        content-visibility: auto;
      }
      
      /* 스크롤 최적화 */
      * {
        scroll-behavior: smooth;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}