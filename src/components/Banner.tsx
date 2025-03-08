
import { cn } from "@/lib/utils";

interface BannerProps {
  className?: string;
}

export function Banner({ className }: BannerProps) {
  const handleClick = () => {
    window.open("https://lovable.dev/?via=alphagogogo", "_blank");
  };

  return (
    <div 
      onClick={handleClick}
      className={cn(
        "bg-gradient-to-r from-purple-700 to-purple-500 text-white px-6 py-4 rounded-lg shadow-lg cursor-pointer",
        "hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 mb-8 select-none",
        className
      )}
      role="button"
      aria-label="노코드 개발 AI, 러버블 DEV 사이트로 이동"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0 md:w-1/2">
          <h3 className="font-bold text-xl md:text-2xl mb-1">이젠 코딩 지식 없이도 누구나 웹 서비스 개발 가능!</h3>
          <p className="text-white/90 text-sm md:text-base">
            AI가 당신의 아이디어를 현실로 만들어 드립니다.
          </p>
        </div>
        
        <div className="mb-4 md:mb-0 md:text-center hidden md:block">
          <div className="font-bold text-lg">노코드 웹 개발 AI</div>
          <div className="font-extrabold text-xl">러버블 DEV</div>
        </div>
        
        <div className="bg-white/20 px-4 py-2 rounded-md hover:bg-white/30 text-sm font-medium">
          지금 바로 시작하기
        </div>
      </div>
    </div>
  );
}
