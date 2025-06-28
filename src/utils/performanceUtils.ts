
// 성능 모니터링 및 최적화 유틸리티
export const measurePerformance = (name: string, fn: () => Promise<any>) => {
  return async (...args: any[]) => {
    const startTime = performance.now();
    
    try {
      const result = await fn.apply(null, args);
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
      
      // 성능 메트릭이 느린 경우 경고
      if (duration > 1000) {
        console.warn(`[Performance Warning] ${name} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.error(`[Performance Error] ${name} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  };
};

// API 호출 최적화를 위한 디바운스
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

// 이미지 레이지 로딩 옵션
export const getImageLoadingProps = (priority = false) => {
  return {
    loading: priority ? "eager" as const : "lazy" as const,
    decoding: "async" as const,
  };
};

// 중요하지 않은 리소스 지연 로딩
export const loadResourceAsync = (src: string, type: 'script' | 'style' = 'script') => {
  return new Promise((resolve, reject) => {
    const element = document.createElement(type === 'script' ? 'script' : 'link');
    
    if (type === 'script') {
      (element as HTMLScriptElement).src = src;
      (element as HTMLScriptElement).async = true;
    } else {
      (element as HTMLLinkElement).href = src;
      (element as HTMLLinkElement).rel = 'stylesheet';
    }
    
    element.onload = resolve;
    element.onerror = reject;
    
    document.head.appendChild(element);
  });
};
