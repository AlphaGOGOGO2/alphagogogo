
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

// Google AdSense 초기화 및 디버깅
const initializeAdSense = () => {
  try {
    // AdSense 배열 초기화 - 단 한번만
    if (!window.adsbygoogle) {
      window.adsbygoogle = [];
      console.log('AdSense 배열 초기화 완료');
    }

    // AdSense 스크립트 로드 상태 확인
    const adSenseScript = document.querySelector('script[src*="adsbygoogle.js"]');
    if (adSenseScript) {
      console.log('AdSense 스크립트 감지됨');
    } else {
      console.warn('AdSense 스크립트가 감지되지 않음');
    }

    // CSP 정책 확인
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (cspMeta) {
      const cspContent = cspMeta.getAttribute('content') || '';
      if (cspContent.includes('pagead2.googlesyndication.com')) {
        console.log('CSP에서 AdSense 도메인 허용됨');
      } else {
        console.error('CSP에서 AdSense 도메인이 차단됨');
      }
    }
  } catch (error) {
    console.error('AdSense 초기화 중 오류:', error);
  }
};

// 서비스 워커 등록
registerServiceWorker();

// AdSense 초기화
initializeAdSense();

createRoot(document.getElementById("root")!).render(<App />);
