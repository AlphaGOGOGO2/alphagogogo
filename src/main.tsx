
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker } from './registerSW';
import { initWebVitals, PerformanceMonitor } from './utils/webVitals.ts';
import { initErrorTracking, startHealthMonitoring } from './utils/healthCheck.ts';

// AdSense 전역 타입 선언
declare global {
  interface Window {
    adsbygoogle: any[] & {
      loaded?: boolean;
      push: (ad: any) => void;
    };
  }
}

// 최적화된 AdSense 초기화
const initializeAdSense = () => {
  try {
    console.log('[AdSense] 초기화 시작');
    
    if (!window.adsbygoogle) {
      window.adsbygoogle = [] as any;
      console.log('[AdSense] 전역 배열 초기화 완료');
    }

    // AdSense 스크립트 상태 확인
    const adSenseScript = document.querySelector('script[src*="adsbygoogle.js"]');
    if (adSenseScript) {
      console.log('[AdSense] 스크립트 감지됨');
      
      adSenseScript.addEventListener('load', () => {
        console.log('[AdSense] 스크립트 로드 완료');
      });
      
      adSenseScript.addEventListener('error', (error) => {
        console.error('[AdSense] 스크립트 로드 오류:', error);
      });
    } else {
      console.warn('[AdSense] 스크립트를 찾을 수 없습니다');
    }

    // CSP 정책 검증
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]') as HTMLMetaElement;
    if (cspMeta) {
      const cspContent = cspMeta.content || '';
      console.log('[AdSense] CSP 정책 확인됨');
      
      const requiredDomains = ['pagead2.googlesyndication.com', 'googletagservices.com'];
      const hasRequiredDomains = requiredDomains.every(domain => cspContent.includes(domain));
      
      if (hasRequiredDomains) {
        console.log('[AdSense] ✅ CSP에서 AdSense 도메인 허용됨');
      } else {
        console.warn('[AdSense] ⚠️ CSP에서 AdSense 도메인 일부가 차단될 수 있습니다');
      }
    }

    // 지연된 AdSense 로드 상태 확인
    setTimeout(() => {
      const adSenseLoaded = window.adsbygoogle && typeof window.adsbygoogle.push === 'function';
      if (adSenseLoaded) {
        console.log('[AdSense] ✅ 정상 로드됨');
      } else {
        console.warn('[AdSense] ⚠️ 로드 지연 또는 차단됨');
      }
    }, 2000); // 2초로 단축

  } catch (error) {
    console.error('[AdSense] 초기화 오류:', error);
  }
};

// 성능 모니터링
const monitorPerformance = () => {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (perfData) {
          console.log('[Performance] 페이지 로딩 시간:', {
            DOMContentLoaded: perfData.domContentLoadedEventEnd - perfData.startTime,
            FullLoad: perfData.loadEventEnd - perfData.startTime,
            FirstByte: perfData.responseStart - perfData.startTime
          });
        }
      }, 0);
    });
  }
};

// 서비스 및 모니터링 초기화
registerServiceWorker();
initializeAdSense();
monitorPerformance();
initErrorTracking();

// Web Vitals 및 성능 모니터링 초기화
if (typeof window !== 'undefined') {
  initWebVitals();
  const performanceMonitor = PerformanceMonitor.getInstance();
  performanceMonitor.init();
  
  // 번들 분석 초기화 (지연 실행)
  setTimeout(() => {
    import('@/utils/bundleAnalyzer').then(({ bundleAnalyzer }) => {
      bundleAnalyzer.analyzeBundle();
    });
  }, 5000);
  
  // 헬스 모니터링 시작 (30초마다)
  const healthCheckInterval = startHealthMonitoring(30000);
  
  // 페이지 언로드 시 정리
  window.addEventListener('beforeunload', () => {
    performanceMonitor.cleanup();
    if (healthCheckInterval) {
      clearInterval(healthCheckInterval);
    }
  });
}

// 앱 렌더링을 DOM이 완전히 로드된 후에 실행
function renderApp() {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found");
    return;
  }
  
  try {
    createRoot(rootElement).render(<App />);
    console.log("App successfully rendered");
  } catch (error) {
    console.error("Failed to render app:", error);
    // 폴백 UI 표시
    rootElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: system-ui;">
        <div style="text-align: center; padding: 2rem; background: #f3f4f6; border-radius: 0.5rem; border: 1px solid #d1d5db;">
          <h2 style="color: #ef4444; margin-bottom: 1rem;">사이트 로딩 중 문제가 발생했습니다</h2>
          <p style="color: #6b7280; margin-bottom: 1rem;">잠시 후 다시 시도해주세요.</p>
          <button onclick="window.location.reload()" style="background: #7c3aed; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.25rem; cursor: pointer;">
            새로고침
          </button>
        </div>
      </div>
    `;
  }
}

// DOM이 준비되면 앱 렌더링
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
