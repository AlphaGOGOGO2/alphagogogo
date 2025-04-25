
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Declare adsbygoogle for Google AdSense
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// Initialize adsbygoogle array if not exists (자동 광고를 위한 배열 초기화만 수행)
window.adsbygoogle = window.adsbygoogle || [];
// 자동 광고 설정이므로 push({}) 호출 제거

createRoot(document.getElementById("root")!).render(<App />);
