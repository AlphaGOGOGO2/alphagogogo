
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
  const adRef = useRef<HTMLDivElement>(null);
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // 광고 슬롯의 고유 식별자 (없으면 랜덤 생성)
  const slotId = adSlot || `auto-ad-${Math.random().toString(36).substring(2, 15)}`;

  useEffect(() => {
    // 개발 환경에서는 광고 초기화 건너뛰기
    if (isDevelopment) return;

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
      // 자동 광고 설정이므로 추가 초기화 없이 슬롯만 추적
      initializedSlots.add(slotId);
      setIsAdInitialized(true);
      console.log(`AdSense slot ${slotId} marked as initialized`);
    } catch (error) {
      console.error('Error with AdSense slot:', error);
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

  return (
    <div className={`adsense-container ${className}`} ref={adRef}>
      {/* 
        자동 광고를 사용하는 경우, 개별 광고 태그를 삽입하지 않아도 됩니다.
        그러나 특정 위치에 광고를 추가하려면 아래 태그를 유지하되,
        초기화는 전역에서 한 번만 수행합니다.
      */}
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
