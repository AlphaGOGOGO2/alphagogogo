
import { useEffect } from 'react';

interface AdSenseProps {
  adSlot?: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  style?: React.CSSProperties;
  className?: string;
}

export const AdSense: React.FC<AdSenseProps> = ({
  adSlot,
  adFormat = 'auto',
  style = {},
  className = '',
}) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    try {
      // Only run this effect in production environment
      if (!isDevelopment && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        console.log('AdSense ad pushed to queue');
      }
    } catch (error) {
      console.error('Error initializing AdSense ad:', error);
    }
  }, []);

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
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          ...style,
        }}
        data-ad-client="ca-pub-2328910037798111"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};

