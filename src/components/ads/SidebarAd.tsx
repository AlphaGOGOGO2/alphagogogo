
import { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

interface SidebarAdProps {
  slot: string;
  className?: string;
}

export function SidebarAd({ slot, className }: SidebarAdProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !adRef.current) return;

    // 기존 광고 요소 제거
    adRef.current.innerHTML = '';
    
    try {
      const adElement = document.createElement('ins');
      adElement.className = 'adsbygoogle';
      adElement.style.display = 'block';
      adElement.dataset.adClient = 'ca-pub-2328910037798111';
      adElement.dataset.adSlot = slot;
      adElement.dataset.adFormat = 'vertical';
      adElement.dataset.fullWidthResponsive = 'false';
      
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
  }, [slot]);

  return (
    <div 
      ref={adRef}
      className={cn(
        "min-h-[600px] w-[160px] hidden lg:block",
        className
      )}
      data-ad-slot={slot}
    />
  );
}
