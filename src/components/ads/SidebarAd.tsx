
import { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";

interface SidebarAdProps {
  slot: string;
  className?: string;
}

export function SidebarAd({ slot, className }: SidebarAdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [adAttempts, setAdAttempts] = useState(0);
  const maxAttempts = 2;

  useEffect(() => {
    // 개발 환경에서는 광고 표시 안함
    if (process.env.NODE_ENV === 'development') return;
    
    if (typeof window === 'undefined' || !adRef.current) return;
    
    // 이미 광고가 로드되었으면 다시 로드하지 않음
    if (isAdLoaded) return;
    
    // 최대 시도 횟수를 초과했다면 더 이상 시도하지 않음
    if (adAttempts >= maxAttempts) return;

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
          console.log('SidebarAd push successful for slot:', slot);
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
    } catch (err) {
      console.error('Ad creation error:', err);
    }

    // 광고 로딩 확인 및 재시도
    const checkAd = setTimeout(() => {
      if (adRef.current && adRef.current.querySelector('iframe')) {
        setIsAdLoaded(true);
        console.log('SidebarAd loaded successfully for slot:', slot);
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
  }, [slot, isAdLoaded, adAttempts]);

  return (
    <div 
      ref={adRef}
      className={cn(
        "min-h-[600px] w-[160px] hidden lg:block",
        className
      )}
      data-ad-slot={slot}
    >
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 h-[600px] w-[160px] flex items-center justify-center text-gray-500 text-sm text-center p-2">
          광고 영역<br/>(개발 환경)
        </div>
      )}
    </div>
  );
}
