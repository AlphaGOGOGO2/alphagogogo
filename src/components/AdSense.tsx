
import { useEffect, useState, useRef } from 'react';

interface AdSenseProps {
  adSlot?: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  style?: React.CSSProperties;
  className?: string;
}

// 전역 변수로 이미 초기화된 슬롯을 추적
const initializedSlots = new Set<string>();

export const AdSense: React.FC<AdSenseProps> = ({
  adSlot,
  adFormat = 'auto',
  style = {},
  className = '',
}) => {
  const [isAdInitialized, setIsAdInitialized] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);
  const adRef = useRef<HTMLDivElement>(null);
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // 광고 슬롯의 고유 식별자 (없으면 랜덤 생성)
  const slotId = adSlot || `auto-ad-${Math.random().toString(36).substring(2, 15)}`;

  useEffect(() => {
    // 개발 환경에서는 광고 초기화 건너뛰기
    if (isDevelopment) {
      console.log('개발 환경: AdSense 광고 표시 건너뛰기');
      return;
    }

    // 이미 이 슬롯이 초기화되었는지 확인
    if (initializedSlots.has(slotId)) {
      console.log(`AdSense slot ${slotId} already initialized, skipping`);
      return;
    }

    // 이미 컴포넌트 인스턴스가 초기화되었는지 확인
    if (isAdInitialized) return;

    // DOM에 요소가 있는지 확인
    if (!adRef.current) return;

    try {
      // AdSense 스크립트가 로드되었는지 확인
      if (typeof window.adsbygoogle === 'undefined') {
        console.error('AdSense 스크립트가 로드되지 않았습니다.');
        setAdError('AdSense 스크립트 로드 실패');
        return;
      }

      // 광고 푸시 시도
      console.log(`AdSense 광고 초기화 시도: ${slotId}`);
      
      // 광고가 이미 처리되었는지 확인
      const adElement = adRef.current.querySelector('.adsbygoogle') as HTMLElement;
      if (adElement && adElement.getAttribute('data-adsbygoogle-status')) {
        console.log(`광고가 이미 처리됨: ${slotId}`);
        return;
      }

      // 광고 푸시
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      
      initializedSlots.add(slotId);
      setIsAdInitialized(true);
      console.log(`AdSense 광고 초기화 완료: ${slotId}`);
      
    } catch (error) {
      console.error('AdSense 광고 초기화 오류:', error);
      setAdError(error instanceof Error ? error.message : '알 수 없는 오류');
    }
  }, [isDevelopment, isAdInitialized, slotId]);

  if (isDevelopment) {
    return (
      <div 
        className={`adsense-placeholder ${className}`}
        style={{
          background: 'rgba(156, 39, 176, 0.1)',
          border: '2px dashed #9c27b0',
          borderRadius: '4px',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: adFormat === 'horizontal' ? '90px' : '280px',
          width: '100%',
          maxWidth: adFormat === 'horizontal' ? '728px' : '336px',
          margin: '0 auto',
          ...style,
        }}
      >
        <p className="text-purple-600 font-medium text-center">
          {adFormat === 'horizontal' ? '광고 배너 (728x90)' : '광고 배너 (336x280)'}
          <br />
          <span className="text-sm text-purple-400">개발 환경에서만 보이는 플레이스홀더입니다</span>
        </p>
      </div>
    );
  }

  // 에러가 있는 경우 에러 표시 (프로덕션에서는 숨김)
  if (adError) {
    console.error('AdSense 오류:', adError);
  }

  return (
    <div className={`adsense-container ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          ...style,
        }}
        data-ad-client="ca-pub-2328910037798111"
        data-ad-slot={adSlot || ''}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};
