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
      // 개발 환경에서 추가 로깅
      if (process.env.NODE_ENV === 'development') {
        console.log('AdBanner: Attempting to load ad', { slot, format });
      }

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
        
        // 추가 에러 처리 및 로깅
        if (!adsbygoogle) {
          console.error('AdSense script not loaded correctly');
          return;
        }

        adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense 로딩 중 오류 발생:', error);
      
      // 프로덕션에서도 상세 에러 로깅
      if (process.env.NODE_ENV === 'production') {
        // 추후 모니터링을 위한 에러 로깅 서비스 추가 가능
      }
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
      style={{
        ...style,
        minHeight: '90px', // 광고 최소 높이 보장
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      aria-label="광고"
    >
      {/* 광고 로딩 중 또는 광고 없을 때 대체 텍스트 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-gray-500 text-sm">
          광고 로딩 중 또는 설정 필요
        </div>
      )}
    </div>
  );
};

// 전역 adsbygoogle 배열 선언
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
