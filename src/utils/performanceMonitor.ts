import { logger } from '@/utils/logger';

// 고급 성능 모니터링 클래스
export class AdvancedPerformanceMonitor {
  private static instance: AdvancedPerformanceMonitor;
  private observers: PerformanceObserver[] = [];
  private metrics: Map<string, any> = new Map();

  static getInstance() {
    if (!AdvancedPerformanceMonitor.instance) {
      AdvancedPerformanceMonitor.instance = new AdvancedPerformanceMonitor();
    }
    return AdvancedPerformanceMonitor.instance;
  }

  // 초기화
  init() {
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeResourceTiming();
    this.observeNavigationTiming();
    this.monitorRenderPerformance();
  }

  // LCP (Largest Contentful Paint) 관찰
  private observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        this.metrics.set('LCP', lastEntry.startTime);
        
        if (lastEntry.startTime > 2500) {
          console.warn(`[성능 경고] LCP가 느립니다: ${lastEntry.startTime.toFixed(2)}ms`);
        }
        
        console.log(`[성능 메트릭] LCP: ${lastEntry.startTime.toFixed(2)}ms`);
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.error('[LCP 관찰 실패]', error);
    }
  }

  // FID (First Input Delay) 관찰
  private observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const delay = entry.processingStart - entry.startTime;
          this.metrics.set('FID', delay);
          
          if (delay > 100) {
            console.warn(`[성능 경고] FID가 느립니다: ${delay.toFixed(2)}ms`);
          }
          
          console.log(`[성능 메트릭] FID: ${delay.toFixed(2)}ms`);
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (error) {
      console.error('[FID 관찰 실패]', error);
    }
  }

  // CLS (Cumulative Layout Shift) 관찰
  private observeCLS() {
    try {
      let clsValue = 0;
      let clsEntries: any[] = [];

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            clsEntries.push(entry);
          }
        });

        this.metrics.set('CLS', clsValue);
        
        if (clsValue > 0.1) {
          console.warn(`[성능 경고] CLS가 높습니다: ${clsValue.toFixed(4)}`);
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (error) {
      console.error('[CLS 관찰 실패]', error);
    }
  }

  // 리소스 타이밍 관찰
  private observeResourceTiming() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          // 느린 리소스 로딩 감지
          if (entry.duration > 1000) {
            console.warn(`[성능 경고] 느린 리소스 로딩: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
          }
          
          // 큰 이미지 파일 감지
          if (entry.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) && entry.transferSize > 500000) {
            console.warn(`[성능 경고] 큰 이미지 파일: ${entry.name} - ${(entry.transferSize / 1024).toFixed(2)}KB`);
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    } catch (error) {
      console.error('[리소스 타이밍 관찰 실패]', error);
    }
  }

  // 네비게이션 타이밍 관찰
  private observeNavigationTiming() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const timings = {
            DNS: entry.domainLookupEnd - entry.domainLookupStart,
            TCP: entry.connectEnd - entry.connectStart,
            TLS: entry.secureConnectionStart > 0 ? entry.connectEnd - entry.secureConnectionStart : 0,
            TTFB: entry.responseStart - entry.requestStart,
            Download: entry.responseEnd - entry.responseStart,
            DOMContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            Load: entry.loadEventEnd - entry.loadEventStart
          };

          this.metrics.set('NavigationTiming', timings);
          console.log('[네비게이션 타이밍]', timings);
        });
      });

      observer.observe({ entryTypes: ['navigation'] });
      this.observers.push(observer);
    } catch (error) {
      console.error('[네비게이션 타이밍 관찰 실패]', error);
    }
  }

  // 렌더링 성능 모니터링
  private monitorRenderPerformance() {
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
        this.metrics.set('FPS', fps);
        
        if (fps < 30) {
          console.warn(`[성능 경고] 낮은 FPS: ${fps}`);
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  // 메모리 사용량 모니터링
  monitorMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryInfo = {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      };

      this.metrics.set('Memory', memoryInfo);
      
      // 메모리 사용량이 80% 이상일 때 경고
      if (memoryInfo.used / memoryInfo.limit > 0.8) {
        console.warn(`[성능 경고] 높은 메모리 사용량: ${memoryInfo.used}MB / ${memoryInfo.limit}MB`);
      }

      return memoryInfo;
    }
    return null;
  }

  // 성능 보고서 생성
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: Object.fromEntries(this.metrics),
      memory: this.monitorMemoryUsage(),
      userAgent: navigator.userAgent,
      connection: (navigator as any).connection ? {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink,
        rtt: (navigator as any).connection.rtt
      } : null
    };

    console.log('[성능 보고서]', report);
    return report;
  }

  // 정리
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

export const performanceMonitor = AdvancedPerformanceMonitor.getInstance();