
import { useEffect, useState, useRef } from 'react';

interface AdSenseProps {
  adSlot?: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  style?: React.CSSProperties;
  className?: string;
  priority?: 'high' | 'low';
}

// 전역 변수로 이미 초기화된 슬롯을 추적
const initializedSlots = new Set<string>();

export const AdSense: React.FC<AdSenseProps> = ({
  adSlot,
  adFormat = 'auto',
  style = {},
  className = '',
  priority = 'low',
}) => {
  const [isAdInitialized, setIsAdInitialized] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);
  const [adStatus, setAdStatus] = useState<string>('loading');
  const adRef = useRef<HTMLDivElement>(null);
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // 광고 슬롯의 고유 식별자 (없으면 랜덤 생성)
  const slotId = adSlot || `auto-ad-${Math.random().toString(36).substring(2, 15)}`;

  useEffect(() => {
    // 개발 환경에서는 광고 초기화 건너뛰기
    if (isDevelopment) {
      console.log('개발 환경: AdSense 광고 표시 건너뛰기');
      setAdStatus('dev-mode');
      return;
    }

    const initializeAd = async () => {
      try {
        console.log(`[AdSense] 광고 초기화 시작: ${slotId}`);
        
        // AdSense 스크립트 로드 확인
        if (typeof window.adsbygoogle === 'undefined') {
          console.error('[AdSense] adsbygoogle 스크립트가 로드되지 않았습니다.');
          setAdError('AdSense 스크립트 로드 실패');
          setAdStatus('script-error');
          return;
        }

        // DOM 요소 확인
        if (!adRef.current) {
          console.error('[AdSense] DOM 요소를 찾을 수 없습니다.');
          setAdError('DOM 요소 없음');
          setAdStatus('dom-error');
          return;
        }

        // 이미 초기화된 슬롯인지 확인
        if (initializedSlots.has(slotId)) {
          console.log(`[AdSense] 슬롯 ${slotId}은 이미 초기화됨`);
          setAdStatus('already-initialized');
          return;
        }

        // 광고 요소 찾기
        const adElement = adRef.current.querySelector('.adsbygoogle') as HTMLElement;
        if (!adElement) {
          console.error('[AdSense] .adsbygoogle 요소를 찾을 수 없습니다.');
          setAdError('광고 요소 없음');
          setAdStatus('element-error');
          return;
        }

        // 이미 처리된 광고인지 확인
        if (adElement.getAttribute('data-adsbygoogle-status')) {
          console.log(`[AdSense] 광고가 이미 처리됨: ${slotId}`);
          setAdStatus('already-processed');
          return;
        }

        console.log(`[AdSense] 광고 푸시 시도: ${slotId}`);
        
        // 광고 푸시
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        
        // 초기화 상태 업데이트
        initializedSlots.add(slotId);
        setIsAdInitialized(true);
        setAdStatus('initialized');
        
        console.log(`[AdSense] 광고 초기화 완료: ${slotId}`);

        // 광고 로드 상태 확인을 위한 타이머
        setTimeout(() => {
          const status = adElement.getAttribute('data-adsbygoogle-status');
          if (status === 'done') {
            setAdStatus('loaded');
            console.log(`[AdSense] 광고 로드 완료: ${slotId}`);
          } else if (status === 'filled') {
            setAdStatus('filled');
            console.log(`[AdSense] 광고 채움 완료: ${slotId}`);
          } else {
            console.log(`[AdSense] 광고 상태: ${status || 'unknown'}`);
          }
        }, 3000);
        
      } catch (error) {
        console.error('[AdSense] 광고 초기화 오류:', error);
        setAdError(error instanceof Error ? error.message : '알 수 없는 오류');
        setAdStatus('error');
      }
    };

    // 우선순위가 높은 광고는 즉시 로드, 그렇지 않으면 지연 로드
    const delay = priority === 'high' ? 100 : 1000;
    const timer = setTimeout(initializeAd, delay);
    
    return () => clearTimeout(timer);
  }, [isDevelopment, slotId, priority]);

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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: adFormat === 'horizontal' ? '90px' : '280px',
          width: '100%',
          maxWidth: adFormat === 'horizontal' ? '728px' : '336px',
          margin: '0 auto',
          ...style,
        }}
        aria-label="광고 배너 자리표시자"
      >
        <p className="text-purple-600 font-medium text-center">
          {adFormat === 'horizontal' ? '광고 배너 (728x90)' : '광고 배너 (336x280)'}
          <br />
          <span className="text-sm text-purple-400">개발 환경에서만 보이는 플레이스홀더입니다</span>
          <br />
          <span className="text-xs text-purple-300">상태: {adStatus}</span>
        </p>
      </div>
    );
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
        aria-label="Google 광고"
      />
      {/* 디버깅을 위한 상태 표시 (프로덕션에서는 숨김) */}
      {adError && process.env.NODE_ENV === 'development' && (
        <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>
          Debug: {adStatus} - {adError}
        </div>
      )}
    </div>
  );
};
