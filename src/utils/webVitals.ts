// Web Vitals tracking and performance monitoring

export interface WebVitalsMetric {
  id: string;
  name: 'CLS' | 'FCP' | 'INP' | 'LCP' | 'TTFB'; // FID를 INP로 교체
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries: PerformanceEntry[];
}

// Performance thresholds based on Google's Core Web Vitals
const VITALS_THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  INP: { good: 200, poor: 500 }, // FID 대신 INP 사용
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 }
};

// Rate limiting for analytics calls
let analyticsQueue: WebVitalsMetric[] = [];
let isProcessingQueue = false;

export function getRating(name: WebVitalsMetric['name'], value: number): WebVitalsMetric['rating'] {
  const thresholds = VITALS_THRESHOLDS[name];
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

export function sendToAnalytics(metric: WebVitalsMetric) {
  // Add to queue instead of sending immediately
  analyticsQueue.push(metric);
  
  if (!isProcessingQueue) {
    processAnalyticsQueue();
  }
}

async function processAnalyticsQueue() {
  if (isProcessingQueue || analyticsQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  try {
    // Process in batches to avoid overwhelming the server
    while (analyticsQueue.length > 0) {
      const batch = analyticsQueue.splice(0, 5); // Process 5 at a time
      
      await Promise.all(
        batch.map(async (metric) => {
          try {
            // Send to Google Analytics 4 if available
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', metric.name, {
                event_category: 'Web Vitals',
                event_label: metric.id,
                value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                custom_map: {
                  metric_rating: metric.rating,
                  metric_delta: metric.delta
                }
              });
            }
            
            // Log to console in development
            if (process.env.NODE_ENV === 'development') {
              console.log(`[Web Vitals] ${metric.name}:`, {
                value: metric.value,
                rating: metric.rating,
                id: metric.id
              });
            }
            
            // Send to your own analytics endpoint if needed
            // await fetch('/api/analytics/web-vitals', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(metric)
            // });
            
          } catch (error) {
            console.error('[Web Vitals] Failed to send metric:', error);
          }
        })
      );
      
      // Small delay between batches
      if (analyticsQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  } finally {
    isProcessingQueue = false;
  }
}

// Initialize Web Vitals tracking
export function initWebVitals() {
  if (typeof window === 'undefined') return;
  
  // Dynamic import to avoid SSR issues
  import('web-vitals').then((webVitals) => {
    webVitals.onCLS(sendToAnalytics);
    webVitals.onFCP(sendToAnalytics);
    webVitals.onINP(sendToAnalytics); // FID 대신 INP 사용
    webVitals.onLCP(sendToAnalytics);
    webVitals.onTTFB(sendToAnalytics);
  }).catch((error) => {
    console.warn('[Web Vitals] Failed to load web-vitals library:', error);
  });
}

// Custom performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private observers: PerformanceObserver[] = [];
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  init() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }
    
    // Monitor long tasks
    this.observeLongTasks();
    
    // Monitor navigation timing
    this.observeNavigationTiming();
    
    // Monitor resource loading
    this.observeResourceTiming();
  }
  
  private observeLongTasks() {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (entry.duration > 50) { // Tasks longer than 50ms
            console.warn('[Performance] Long task detected:', {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name
            });
            
            // Send to analytics
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'long_task', {
                event_category: 'Performance',
                value: Math.round(entry.duration)
              });
            }
          }
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('[Performance] Failed to observe long tasks:', error);
    }
  }
  
  private observeNavigationTiming() {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          const metrics = {
            dns: entry.domainLookupEnd - entry.domainLookupStart,
            tcp: entry.connectEnd - entry.connectStart,
            ssl: entry.connectEnd - entry.secureConnectionStart,
            ttfb: entry.responseStart - entry.requestStart,
            download: entry.responseEnd - entry.responseStart,
            domParse: entry.domContentLoadedEventStart - entry.responseEnd,
            domReady: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            load: entry.loadEventEnd - entry.loadEventStart
          };
          
          console.log('[Performance] Navigation timing:', metrics);
        });
      });
      
      observer.observe({ entryTypes: ['navigation'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('[Performance] Failed to observe navigation timing:', error);
    }
  }
  
  private observeResourceTiming() {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          // Log slow resources
          if (entry.duration > 1000) { // Resources taking more than 1 second
            console.warn('[Performance] Slow resource:', {
              name: entry.name,
              duration: entry.duration,
              size: entry.transferSize,
              type: entry.initiatorType
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('[Performance] Failed to observe resource timing:', error);
    }
  }
  
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Memory usage monitoring
export function monitorMemoryUsage() {
  if (typeof window === 'undefined' || !(performance as any).memory) {
    return;
  }
  
  const memory = (performance as any).memory;
  const memoryInfo = {
    used: memory.usedJSHeapSize,
    total: memory.totalJSHeapSize,
    limit: memory.jsHeapSizeLimit,
    usage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
  };
  
  // Warn if memory usage is high
  if (memoryInfo.usage > 80) {
    console.warn('[Performance] High memory usage detected:', memoryInfo);
  }
  
  return memoryInfo;
}