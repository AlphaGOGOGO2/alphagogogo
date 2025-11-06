
import { cn } from "@/lib/utils";

interface BannerProps {
  className?: string;
}

export function Banner({ className }: BannerProps) {
  const handleClick = () => {
    window.open("https://lovable.dev/?via=alphagogogo", "_blank");
  };

  return (
    <section
      onClick={handleClick}
      className={cn(
        "w-full bg-gradient-to-r from-purple-700 to-purple-500 text-white py-6 px-6 cursor-pointer rounded-lg shadow-lg",
        "hover:opacity-90 transition-all duration-300 select-none",
        className
      )}
      role="button"
      aria-label="노코드 개발 AI, 러버블 DEV 사이트로 이동"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-4 text-center lg:text-left">
          <div className="text-white space-y-2">
            <h3 className="font-bold text-2xl lg:text-3xl">이젠 코딩 지식 없이도 누구나 웹 서비스 개발 가능!</h3>
            <p className="text-white/90 text-base">
              AI가 당신의 아이디어를 현실로 만들어 드립니다.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xl lg:text-2xl font-bold">
              노코드 웹 개발 AI <span className="font-extrabold text-yellow-300 lg:text-3xl">러버블 DEV</span>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-md hover:bg-white/30 text-sm font-medium whitespace-nowrap">
              지금 바로 시작하기
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
