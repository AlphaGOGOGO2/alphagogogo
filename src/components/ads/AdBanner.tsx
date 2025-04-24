
import { useEffect, useRef, useState } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical';
  style?: React.CSSProperties;
  className?: string;
}

export const AdBanner = ({ slot, format = 'auto', style, className }: AdBannerProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [adAttempts, setAdAttempts] = useState(0);
  const [adVisible, setAdVisible] = useState(false);
  const maxAttempts = 2;

  // 광고 요소가 화면에 보이는지 확인
  useEffect(() => {
    if (!adRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setAdVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    observer.observe(adRef.current);
    
    return () => {
      if (adRef.current) observer.unobserve(adRef.current);
    };
  }, []);

  useEffect(() => {
    // 페이지가 완전히 로드되었는지 확인
    if (document.readyState !== 'complete') {
      const handleLoad = () => {
        initializeAd();
        window.removeEventListener('load', handleLoad);
      };
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    } else {
      initializeAd();
    }

    function initializeAd() {
      // 개발 환경에서는 광고 표시 안함
      if (process.env.NODE_ENV === 'development') return;
      
      if (typeof window === 'undefined' || !adRef.current) return;
      
      // 이미 광고가 로드되었으면 다시 로드하지 않음
      if (isAdLoaded) return;
      
      // 최대 시도 횟수를 초과했다면 더 이상 시도하지 않음
      if (adAttempts >= maxAttempts) return;
      
      // 광고가 화면에 보이지 않으면 로드하지 않음
      if (!adVisible) return;

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

        // 명시적인 최소 크기 설정
        adElement.style.minWidth = '300px';
        adElement.style.minHeight = format === 'rectangle' ? '250px' : '90px';

        adRef.current.appendChild(adElement);

        // 약간의 지연 후 광고 로드 시도
        setTimeout(() => {
          try {
            if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
              window.adsbygoogle.push({});
              console.log('AdSense push successful for slot:', slot);
              setAdAttempts(prev => prev + 1);
            } else {
              console.log('AdSense not loaded yet. Will retry.');
              setTimeout(() => {
                if (window.adsbygoogle) {
                  window.adsbygoogle.push({});
                  setAdAttempts(prev => prev + 1);
                }
              }, 2000);
            }
          } catch (err) {
            console.error('Ad push error:', err);
          }
        }, 500);
      } catch (err) {
        console.error('Ad creation error:', err);
      }

      // 광고 로딩 확인 및 재시도
      const checkAd = setTimeout(() => {
        if (adRef.current && adRef.current.querySelector('iframe')) {
          setIsAdLoaded(true);
          console.log('Ad loaded successfully for slot:', slot);
        } else if (adAttempts < maxAttempts) {
          console.log('Ad not loaded, retrying...');
          setIsAdLoaded(false);
          if (window.adsbygoogle) {
            try {
              window.adsbygoogle.push({});
              setAdAttempts(prev => prev + 1);
            } catch (err) {
              console.error('Retry ad push error:', err);
            }
          }
        }
      }, 3000);

      return () => clearTimeout(checkAd);
    }
  }, [slot, format, isAdLoaded, adAttempts, adVisible]);

  // 광고 컨테이너에 적용할 최소 높이 설정
  const minHeight = format === 'rectangle' ? '250px' : '90px';

  return (
    <div
      ref={adRef}
      className={`ad-container my-6 text-center overflow-hidden ${className || ''}`}
      style={{
        minHeight,
        minWidth: '300px',
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
        <div className="text-gray-500 text-sm bg-gray-100 w-full h-full flex items-center justify-center p-4" style={{ minHeight }}>
          광고 영역 ({format}) - 개발 환경
        </div>
      )}
    </div>
  );
};
