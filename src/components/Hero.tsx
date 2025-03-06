
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Background with more modern gradient */}
      <div className="absolute inset-0 hero-gradient"></div>
      
      {/* Enhanced animated shapes with more vibrant colors */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-16 right-[10%] w-80 h-80 rounded-full bg-[#8e24aa]/30 blur-3xl animate-float purple-glow"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-[#9c27b0]/30 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[20%] w-60 h-60 rounded-full bg-[#6a1b9a]/30 blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[30%] right-[30%] w-40 h-40 rounded-full bg-[#8e24aa]/20 blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 md:px-8 pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col items-center justify-center text-center z-10">
        <div className="stagger-animation">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 animate-fade-in shadow-lg shadow-[#6a1b9a]/20">
            <span className="text-white/90 text-sm font-medium">인공지능의 미래를 탐구하는 공간</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight animate-fade-in max-w-4xl mx-auto text-balance text-white">
            <span className="relative">알파블로그</span>에서 AI의 모든 것을 만나보세요
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-fade-in text-balance">
            인공지능의 최신 발전과 트렌드, 실제 적용 사례와 심층 분석까지 - 복잡한 AI 세계를 쉽고 명확하게 풀어드립니다.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <button className="group animated-button px-6 py-3 rounded-lg bg-gradient-to-r from-[#6a1b9a] to-[#8e24aa] text-white font-medium transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#6a1b9a]/30">
              <span className="relative z-10 flex items-center justify-center">
                최신 블로그 글 보기
                <span className="absolute inset-0 shimmer"></span>
              </span>
            </button>
            <button className="animated-button px-6 py-3 rounded-lg bg-[#6a1b9a]/20 backdrop-blur-sm text-white border border-white/20 font-medium hover:bg-[#6a1b9a]/30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#6a1b9a]/20">
              인기 주제 탐색하기
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
        
        {/* Enhanced scrolling indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-pulse-slow">
          <div className="w-1 h-10 rounded-full relative overflow-hidden bg-gradient-to-b from-white/80 to-white/20">
            <div className="absolute top-0 left-0 right-0 h-5 bg-white/80 animate-[bounce_2s_ease-in-out_infinite]"></div>
          </div>
          <span className="text-white/70 text-xs mt-2 font-light">더 알아보기</span>
        </div>
      </div>
    </section>
  );
}
