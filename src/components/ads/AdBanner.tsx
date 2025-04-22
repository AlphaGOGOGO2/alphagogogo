
import { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical';
  style?: React.CSSProperties;
  className?: string;
}

export const AdBanner = ({ slot, format = 'auto', style, className }: AdBannerProps) => {
  const adRef = useRef<HTMLDivElement>(null);

  // 광고 로딩 함수 (1차, 2차 시도 모두에서 사용)
  const loadAd = () => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('AdBanner: Attempting to load ad', { slot, format });
      }

      if (!window.adsbygoogle) {
        window.adsbygoogle = [];
      }
      const adsbygoogle = window.adsbygoogle;

      if (adRef.current) {
        // 광고 div의 width/height 로깅
        const width = adRef.current.offsetWidth;
        const height = adRef.current.offsetHeight;
        console.log('[AdBanner] 광고 div 크기:', { width, height, slot });

        // 기존 광고 요소 제거
        adRef.current.innerHTML = '';

        const adElement = document.createElement('ins');
        adElement.className = 'adsbygoogle';
        adElement.style.display = 'block';
        adElement.style.textAlign = 'center';
        adElement.style.width = '100%';
        adElement.style.maxWidth = '700px';
        adElement.style.margin = '0 auto';

        // Set format-specific attributes
        if (format === 'fluid') {
          adElement.dataset.adFormat = 'fluid';
        } else {
          adElement.dataset.adFormat = format;
        }
        adElement.dataset.adClient = 'ca-pub-2328910037798111';
        adElement.dataset.adSlot = slot;

        adRef.current.appendChild(adElement);

        if (!adsbygoogle) {
          console.error('AdSense script not loaded correctly');
          return;
        }
        adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense 로딩 중 오류 발생:', error);
      if (process.env.NODE_ENV === 'production') {
        // 추후 에러 로깅 서비스 등 추가 가능
      }
    }
  };

  useEffect(() => {
    // 일단 바로 광고 요청 시도
    loadAd();

    // 혹시 div width가 0이면 500ms뒤에 한 번 더 시도
    if (adRef.current && adRef.current.offsetWidth === 0) {
      setTimeout(() => {
        if (adRef.current && adRef.current.offsetWidth > 0) {
          console.log('[AdBanner] 광고 2차 시도 (width > 0)');
          loadAd();
        } else {
          console.warn('[AdBanner] 광고 div width 아직도 0. 광고를 표시하지 못할 수 있습니다.', { slot });
        }
      }, 500);
    }

    // unmount시 광고 제거
    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
    // eslint-disable-next-line
  }, [slot, format]);

  return (
    <div
      ref={adRef}
      className={`ad-container my-6 text-center overflow-hidden ${className || ''}`}
      style={{
        ...style,
        minHeight: '90px',
        width: '100%',
        maxWidth: '700px',
        margin: '0 auto',
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

