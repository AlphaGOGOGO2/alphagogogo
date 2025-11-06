/**
 * 블로그 AI 홍보 배너 컴포넌트
 * alphablogogo.com으로 연결
 */

import { cn } from "@/lib/utils";

interface BlogAIBannerProps {
  className?: string;
}

export function BlogAIBanner({ className }: BlogAIBannerProps = {}) {
  const handleClick = () => {
    window.open("https://www.alphablogogo.com/", "_blank");
  };

  return (
    <section
      onClick={handleClick}
      className={cn(
        "w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white py-6 px-6 cursor-pointer rounded-lg shadow-lg",
        "hover:opacity-90 transition-all duration-300 select-none",
        className
      )}
      role="button"
      aria-label="블로그 AI 에이전트, 알파블로그 AI 사이트로 이동"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-4 text-center lg:text-left">
          <div className="text-white space-y-2">
            <h3 className="font-bold text-2xl lg:text-3xl">ChatGPT, Claude, Gemini 3대 AI 통합 에이전트</h3>
            <p className="text-white/90 text-base">
              고품격 고품질 블로그 콘텐츠 생성 + 대량생성
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xl lg:text-2xl font-bold">
              블로그 AI 에이전트 <span className="font-extrabold text-yellow-300 lg:text-3xl">알파블로그 AI</span>
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
