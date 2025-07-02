import { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  onLoad,
  onError
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    
    // src가 null, undefined 또는 빈 문자열이면 에러 처리하지 않고 그냥 리턴
    if (!src || src.trim() === '') {
      setHasError(false);
      setIsLoaded(false);
      setImageSrc('');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // 50px 전에 미리 로드
      }
    );

    observer.observe(img);

    return () => {
      observer.disconnect();
    };
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // 이미지 URL 유효성 검사
  const isValidImageUrl = (url: string): boolean => {
    if (!url || url.trim() === '') return false;
    
    // Base64 이미지
    if (url.startsWith('data:image/')) return true;
    
    // HTTP/HTTPS URL
    if (url.startsWith('http://') || url.startsWith('https://')) return true;
    
    // 상대 경로
    if (url.startsWith('/')) return true;
    
    return false;
  };

  // WebP 지원 확인 및 최적화된 이미지 URL 생성
  const getOptimizedImageSrc = (originalSrc: string) => {
    if (!originalSrc || !isValidImageUrl(originalSrc)) return '';
    
    // Supabase Storage 이미지인 경우 최적화 파라미터 추가
    if (originalSrc.includes('supabase.co/storage')) {
      try {
        const url = new URL(originalSrc);
        url.searchParams.set('width', width?.toString() || '800');
        url.searchParams.set('height', height?.toString() || '600');
        url.searchParams.set('format', 'webp');
        url.searchParams.set('quality', '85');
        return url.toString();
      } catch (error) {
        console.warn('Invalid Supabase URL:', originalSrc);
        return originalSrc;
      }
    }
    
    return originalSrc;
  };

  // 이미지 로드 실패 시 기본 플레이스홀더 표시
  if (hasError && src && src.trim() !== '') {
    return (
      <div className={`w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center ${className}`}>
        <div className="text-purple-500 opacity-60">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* src가 없거나 유효하지 않으면 플레이스홀더만 표시 */}
      {!src || src.trim() === '' || !isValidImageUrl(src) ? (
        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
          <div className="text-purple-500 opacity-60">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          </div>
        </div>
      ) : (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          )}
          
          <img
            ref={imgRef}
            src={imageSrc ? getOptimizedImageSrc(imageSrc) : ''}
            alt={alt}
            loading={loading}
            decoding="async"
            width={width}
            height={height}
            className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            onLoad={handleLoad}
            onError={handleError}
            style={{ 
              maxWidth: '100%', 
              height: 'auto',
              aspectRatio: width && height ? `${width} / ${height}` : undefined
            }}
          />
        </>
      )}
    </div>
  );
}

// WebP 지원 감지 함수
export const detectWebPSupport = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// 이미지 프리로딩 함수
export const preloadImages = (imageUrls: string[]): Promise<void[]> => {
  const promises = imageUrls.map((url) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  });
  
  return Promise.all(promises);
};