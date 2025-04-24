
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
  useEffect(() => {
    try {
      // Only run this effect in production environment
      if (process.env.NODE_ENV === 'production' && window.adsbygoogle) {
        // Push the ad to adsbygoogle for rendering
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        console.log('AdSense ad pushed to queue');
      }
    } catch (error) {
      console.error('Error initializing AdSense ad:', error);
    }
  }, []);

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
