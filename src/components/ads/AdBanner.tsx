
import { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical';
  style?: React.CSSProperties;
  className?: string;
}

export const AdBanner = ({ slot, format = 'auto', style, className }: AdBannerProps) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const adsbygoogle = window.adsbygoogle || [];
      
      if (adRef.current) {
        const adElement = document.createElement('ins');
        adElement.className = 'adsbygoogle';
        adElement.style.display = 'block';
        adElement.style.textAlign = 'center';
        
        // Set format-specific attributes
        if (format === 'fluid') {
          adElement.dataset.adFormat = 'fluid';
        } else {
          adElement.dataset.adFormat = format;
        }
        
        adElement.dataset.adClient = 'ca-pub-2328910037798111';
        adElement.dataset.adSlot = slot;

        // Clear the container and insert new ad
        if (adRef.current.firstChild) {
          adRef.current.innerHTML = '';
        }
        
        adRef.current.appendChild(adElement);
        adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }

    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, [slot, format]);

  return (
    <div 
      ref={adRef}
      className={`ad-container my-6 text-center overflow-hidden ${className || ''}`}
      style={style}
      aria-label="광고"
    />
  );
};

// Declare global adsbygoogle array
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
