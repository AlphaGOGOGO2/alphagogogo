
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
    if (typeof window === 'undefined' || !adRef.current) return;

    // 기존 광고 요소 제거
    adRef.current.innerHTML = '';
    
    try {
      const adElement = document.createElement('ins');
      adElement.className = 'adsbygoogle';
      adElement.style.display = 'block';
      adElement.style.textAlign = 'center';
      adElement.dataset.adClient = 'ca-pub-2328910037798111';
      adElement.dataset.adSlot = slot;
      adElement.dataset.adFormat = format;
      adElement.dataset.fullWidthResponsive = 'true';

      adRef.current.appendChild(adElement);

      // 광고 로딩
      try {
        if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
          window.adsbygoogle.push({});
        } else {
          console.log('AdSense not loaded yet. Will retry.');
          setTimeout(() => {
            if (window.adsbygoogle) {
              window.adsbygoogle.push({});
            }
          }, 2000);
        }
      } catch (err) {
        console.error('Ad push error:', err);
      }
    } catch (err) {
      console.error('Ad creation error:', err);
    }

    // 광고 로딩 확인 및 재시도
    const checkAd = setTimeout(() => {
      if (adRef.current && adRef.current.querySelector('iframe') === null) {
        console.log('Ad not loaded, retrying...');
        if (window.adsbygoogle) {
          window.adsbygoogle.push({});
        }
      }
    }, 3000);

    return () => clearTimeout(checkAd);
  }, [slot, format]);

  return (
    <div
      ref={adRef}
      className={`ad-container my-6 text-center overflow-hidden ${className || ''}`}
      style={{
        minHeight: '90px',
        width: '100%',
        maxWidth: '700px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...style
      }}
      data-ad-slot={slot}
      aria-label="광고"
    >
      {process.env.NODE_ENV === 'development' && (
        <div className="text-gray-500 text-sm">
          광고 로딩 중 또는 설정 필요
        </div>
      )}
    </div>
  );
};
