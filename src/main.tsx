
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker } from './registerSW';

// Declare adsbygoogle for Google AdSense
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// Google AdSense 초기화 및 진단
const initializeAdSense = () => {
  try {
    console.log('[AdSense] 초기화 시작');
    
    // AdSense 배열 초기화 - 단 한번만
    if (!window.adsbygoogle) {
      window.adsbygoogle = [];
      console.log('[AdSense] 전역 배열 초기화 완료');
    }

    // AdSense 스크립트 로드 상태 확인
    const adSenseScript = document.querySelector('script[src*="adsbygoogle.js"]');
    if (adSenseScript) {
      console.log('[AdSense] 스크립트 감지됨');
      
      // 스크립트 로드 완료 확인
      adSenseScript.addEventListener('load', () => {
        console.log('[AdSense] 스크립트 로드 완료');
      });
      
      adSenseScript.addEventListener('error', (error) => {
        console.error('[AdSense] 스크립트 로드 오류:', error);
      });
    } else {
      console.error('[AdSense] 스크립트가 감지되지 않음 - HTML에서 스크립트 태그를 확인하세요');
    }

    // CSP 정책 확인
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (cspMeta) {
      const cspContent = cspMeta.getAttribute('content') || '';
      console.log('[AdSense] CSP 정책:', cspContent);
      
      if (cspContent.includes('pagead2.googlesyndication.com')) {
        console.log('[AdSense] ✅ CSP에서 AdSense 도메인 허용됨');
      } else {
        console.error('[AdSense] ❌ CSP에서 AdSense 도메인이 차단됨');
      }
      
      if (cspContent.includes('unsafe-eval')) {
        console.log('[AdSense] ✅ CSP에서 unsafe-eval 허용됨');
      } else {
        console.error('[AdSense] ❌ CSP에서 unsafe-eval이 차단됨 - AdSense에 필요합니다');
      }
    } else {
      console.warn('[AdSense] CSP 메타 태그를 찾을 수 없습니다');
    }

    // 광고 차단 소프트웨어 감지
    setTimeout(() => {
      if (window.adsbygoogle && window.adsbygoogle.loaded) {
        console.log('[AdSense] ✅ AdSense가 정상적으로 로드됨');
      } else {
        console.warn('[AdSense] ⚠️ AdSense 로드가 지연되거나 차단되었을 수 있습니다');
      }
    }, 3000);

  } catch (error) {
    console.error('[AdSense] 초기화 중 오류:', error);
  }
};

// 서비스 워커 등록
registerServiceWorker();

// AdSense 초기화
initializeAdSense();

createRoot(document.getElementById("root")!).render(<App />);
