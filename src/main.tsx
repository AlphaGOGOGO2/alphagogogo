
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Declare adsbygoogle for Google AdSense
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// 단 한번만 초기화되도록 조건 추가
if (!window.adsbygoogle) {
  window.adsbygoogle = [];
  console.log("Google AdSense 배열 초기화됨");
}

createRoot(document.getElementById("root")!).render(<App />);
