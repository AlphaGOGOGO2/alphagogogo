
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

// Google AdSense 배열 초기화 - 단 한번만
if (!window.adsbygoogle) {
  window.adsbygoogle = [];
}

// 서비스 워커 등록
registerServiceWorker();

createRoot(document.getElementById("root")!).render(<App />);
