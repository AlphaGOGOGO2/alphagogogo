
import { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

interface SidebarAdProps {
  slot: string;
  className?: string;
}

export function SidebarAd({ slot, className }: SidebarAdProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && adRef.current) {
        const adElement = document.createElement('ins');
        adElement.className = 'adsbygoogle';
        adElement.style.display = 'block';
        adElement.dataset.adClient = 'ca-pub-2328910037798111';
        adElement.dataset.adSlot = slot;
        adElement.dataset.adFormat = 'vertical';
        
        adRef.current.appendChild(adElement);

        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (err) {
          console.error('Ad push error:', err);
        }
      }
    } catch (err) {
      console.error('Ad creation error:', err);
    }
  }, [slot]);

  return (
    <div 
      ref={adRef}
      className={cn(
        "min-h-[600px] w-[160px] hidden lg:block",
        className
      )}
    />
  );
}
