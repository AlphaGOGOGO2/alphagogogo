
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video 
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          src="https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/videos//background%20video.mp4"
        >
          <source 
            src="https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/videos//background%20video.mp4" 
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-[#1A1F2C]/80 backdrop-blur-[3px]"></div>
      </div>
      
      {/* Enhanced animated shapes with more vibrant colors */}
      <div className="absolute inset-0 overflow-hidden z-[1]">
        <div className="absolute top-16 right-[10%] w-80 h-80 rounded-full bg-[#8e24aa]/30 blur-3xl animate-float purple-glow"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-[#9c27b0]/30 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[20%] w-60 h-60 rounded-full bg-[#6a1b9a]/30 blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[30%] right-[30%] w-40 h-40 rounded-full bg-[#8e24aa]/20 blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>
      
      <div className="relative w-full h-full max-w-7xl mx-auto px-6 md:px-8 flex flex-col items-center justify-center text-center z-10">
        <div className="stagger-animation">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 animate-fade-in shadow-lg shadow-[#6a1b9a]/20">
            <span className="text-white/90 text-sm font-medium">AI를 이해하는 새로운 관점</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight animate-fade-in max-w-4xl mx-auto text-balance text-white">
            <span className="relative text-gradient">알파블로그</span>
            <br className="hidden md:block" />
            AI로 시작하는 퍼스널 브랜딩
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-fade-in text-balance">
            당신만의 브랜드를 AI의 힘으로 구축하고 성장시켜 보세요
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <button className="group relative px-6 py-3 rounded-lg bg-gradient-to-r from-[#6a1b9a] to-[#8e24aa] text-white font-medium transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#6a1b9a]/30 overflow-hidden">
              <span className="relative z-10">최신글 확인하기</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
            </button>
            <button className="animated-button px-6 py-3 rounded-lg bg-[#6a1b9a]/20 backdrop-blur-sm text-white border border-white/20 font-medium hover:bg-[#6a1b9a]/30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#6a1b9a]/20">
              무료 GPTS 이용하기
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
