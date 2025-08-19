import { useEffect } from "react";

interface PreloadCriticalResourcesProps {
  criticalImages?: string[];
  criticalFonts?: string[];
}

export function PreloadCriticalResources({ 
  criticalImages = [], 
  criticalFonts = [] 
}: PreloadCriticalResourcesProps) {
  
  useEffect(() => {
    // 중요 이미지들을 프리로드
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // 중요 폰트들을 프리로드
    criticalFonts.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = href;
      document.head.appendChild(link);
    });
  }, [criticalImages, criticalFonts]);

  return null;
}