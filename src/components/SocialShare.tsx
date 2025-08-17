import { Share2, Facebook, Twitter, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function SocialShare({ 
  url = typeof window !== 'undefined' ? window.location.href : 'https://alphagogogo.com',
  title = "알파고고고 - 최신 AI 소식 & 인사이트",
  description = "AI를 이해하는 새로운 관점으로 최신 인공지능 소식과 실용적인 가이드를 제공합니다.",
  className = ""
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    kakao: `https://story.kakao.com/share?url=${encodedUrl}&text=${encodedTitle}`,
    native: () => {
      if (navigator.share) {
        navigator.share({
          title,
          text: description,
          url
        }).catch(console.error);
      }
    }
  };

  const handleShare = (platform: keyof typeof shareUrls) => {
    if (platform === 'native') {
      shareUrls.native();
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Share2 className="h-4 w-4" />
        공유하기
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg p-3 z-50 min-w-[200px]">
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('facebook')}
              className="w-full justify-start gap-2"
            >
              <Facebook className="h-4 w-4 text-blue-600" />
              Facebook
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('twitter')}
              className="w-full justify-start gap-2"
            >
              <Twitter className="h-4 w-4 text-blue-400" />
              Twitter
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('kakao')}
              className="w-full justify-start gap-2"
            >
              <MessageCircle className="h-4 w-4 text-yellow-500" />
              카카오스토리
            </Button>
            
            {navigator.share && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('native')}
                className="w-full justify-start gap-2"
              >
                <Share2 className="h-4 w-4" />
                더 많은 앱
              </Button>
            )}
          </div>
        </div>
      )}
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}