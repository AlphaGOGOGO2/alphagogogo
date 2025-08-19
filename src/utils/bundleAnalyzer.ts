// 번들 분석 및 최적화 도구
export class BundleAnalyzer {
  private static instance: BundleAnalyzer;
  private chunks: Map<string, number> = new Map();
  
  static getInstance() {
    if (!BundleAnalyzer.instance) {
      BundleAnalyzer.instance = new BundleAnalyzer();
    }
    return BundleAnalyzer.instance;
  }

  // 청크 로딩 시간 측정
  measureChunkLoad(chunkName: string, startTime: number) {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    this.chunks.set(chunkName, loadTime);
    
    if (loadTime > 1000) {
      console.warn(`[Bundle] 느린 청크 로딩 감지: ${chunkName} - ${loadTime.toFixed(2)}ms`);
    }
  }

  // 번들 크기 분석
  analyzeBundle() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    const jsResources = resources.filter(resource => 
      resource.name.includes('.js') && 
      !resource.name.includes('hot-update')
    );

    const cssResources = resources.filter(resource => 
      resource.name.includes('.css')
    );

    const analysis = {
      totalJSSize: jsResources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0),
      totalCSSSize: cssResources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0),
      largestJS: jsResources.sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0))[0],
      slowestChunk: Array.from(this.chunks.entries()).sort((a, b) => b[1] - a[1])[0],
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart
    };

    console.log('[Bundle Analysis]', analysis);
    return analysis;
  }

  // 미사용 CSS 감지
  detectUnusedCSS() {
    const stylesheets = Array.from(document.styleSheets);
    const usedSelectors = new Set<string>();
    
    stylesheets.forEach(stylesheet => {
      try {
        const rules = Array.from(stylesheet.cssRules || stylesheet.rules || []);
        rules.forEach(rule => {
          if (rule instanceof CSSStyleRule) {
            const selectorText = rule.selectorText;
            try {
              if (document.querySelector(selectorText)) {
                usedSelectors.add(selectorText);
              }
            } catch (e) {
              // 복잡한 셀렉터는 무시
            }
          }
        });
      } catch (e) {
        // CORS 에러 등 무시
      }
    });

    return usedSelectors;
  }
}

export const bundleAnalyzer = BundleAnalyzer.getInstance();