import { useState, useEffect, useCallback } from "react";

interface ImageOptimizationProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function ImageOptimization({
  src,
  alt,
  className = "",
  width,
  height,
  loading = "lazy",
  priority = false,
  onLoad,
  onError
}: ImageOptimizationProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>("");

  // WebP 지원 감지 및 최적화된 이미지 URL 생성
  const generateOptimizedSrc = useCallback(() => {
    if (!src) return "";

    // Supabase Storage 이미지인 경우 최적화 파라미터 추가
    if (src.includes('supabase.co/storage')) {
      const url = new URL(src);
      if (width) url.searchParams.set('width', width.toString());
      if (height) url.searchParams.set('height', height.toString());
      url.searchParams.set('quality', '85');
      url.searchParams.set('format', 'webp');
      return url.toString();
    }

    return src;
  }, [src, width, height]);

  useEffect(() => {
    setCurrentSrc(generateOptimizedSrc());
  }, [generateOptimizedSrc]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    // WebP 실패 시 원본 이미지로 폴백
    if (currentSrc.includes('format=webp')) {
      const fallbackSrc = currentSrc.replace(/[?&]format=webp/, '');
      setCurrentSrc(fallbackSrc);
      return;
    }
    
    setHasError(true);
    onError?.();
  }, [currentSrc, onError]);

  if (hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">이미지를 불러올 수 없습니다</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : loading}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
      />
    </div>
  );
}