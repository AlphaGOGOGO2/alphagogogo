
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
        <div className="mb-2 md:mb-0">
          <h3 className="font-bold text-xl md:text-2xl mb-1">러버블 DEV로 웹 개발 시작하기</h3>
          <p className="text-white/90 text-sm md:text-base">
            이젠 코딩 지식 없이도 누구나 웹 서비스를 만들 수 있습니다. AI가 당신의 아이디어를 현실로 만들어 드립니다.
          </p>
        </div>
        <div className="bg-white/20 px-4 py-2 rounded-md hover:bg-white/30 text-sm font-medium">
          지금 바로 시작하기
        </div>
      </div>
    </div>
  );
}
