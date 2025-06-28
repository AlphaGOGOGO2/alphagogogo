
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker } from './registerSW';

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

// 초기화 실행
registerServiceWorker();
initializeAdSense();
monitorPerformance();

createRoot(document.getElementById("root")!).render(<App />);
