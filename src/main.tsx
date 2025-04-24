
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Declare adsbygoogle for Google AdSense
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// Initialize adsbygoogle array if not exists
window.adsbygoogle = window.adsbygoogle || [];

createRoot(document.getElementById("root")!).render(<App />);
