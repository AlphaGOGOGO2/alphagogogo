import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Hero() {
  const scrollToFeaturedPosts = () => {
    const featuredPostsSection = document.getElementById('featured-posts');
    if (featuredPostsSection) {
      featuredPostsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToGPTSSection = () => {
    const gptsSection = document.getElementById('gpts-usage');
    if (gptsSection) {
      gptsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          preload="auto"
          onLoad={() => {
            console.log('Video loaded successfully');
          }}
          onError={(e) => {
            console.error('Video loading error:', e);
            // Show fallback background if video fails
            e.currentTarget.style.display = 'none';
            const fallbackBg = e.currentTarget.parentElement?.querySelector('.fallback-bg');
            if (fallbackBg) {
              (fallbackBg as HTMLElement).style.display = 'block';
            }
          }}
        >
          <source 
            src="/videos/background-video.mp4" 
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        {/* Fallback gradient background - only shown when video fails */}
        <div className="fallback-bg absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" style={{ display: 'none' }}></div>
        <div className="absolute inset-0 bg-[#1E293B]/50 backdrop-blur-[1px]"></div>
      </div>
      
      {/* Subtle animated shapes with lighter colors */}
      <div className="absolute inset-0 overflow-hidden z-[1]">
        <div className="absolute top-16 right-[10%] w-80 h-80 rounded-full bg-purple-500/10 blur-3xl animate-float"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[20%] w-60 h-60 rounded-full bg-indigo-500/10 blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[30%] right-[30%] w-40 h-40 rounded-full bg-violet-500/10 blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>
      
      <div className="relative w-full h-full max-w-7xl mx-auto px-6 md:px-8 flex flex-col items-center justify-center text-center z-10">
        <div className="stagger-animation">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 animate-fade-in shadow-lg">
            <span className="text-white/90 text-sm font-medium">AI를 이해하는 새로운 관점</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight animate-fade-in max-w-4xl mx-auto text-balance text-white">
            AI를 바라보는 시선<br />이제는 미래가 아닌 현재
          </h2>
          
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-fade-in text-balance">
            비개발자, 비전문인의 시선으로 바라보는 AI
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <button 
              onClick={scrollToFeaturedPosts}
              className="group relative px-6 py-3 rounded-lg bg-white text-blue-900 font-medium transition-all transform hover:-translate-y-0.5 shadow-lg overflow-hidden"
            >
              <span className="relative z-10">최신글 확인하기</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-100/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
            </button>
            <button 
              onClick={scrollToGPTSSection}
              className="animated-button px-6 py-3 rounded-lg bg-[#1E293B]/70 backdrop-blur-sm text-white border border-white/20 font-medium hover:bg-[#1E293B]/80 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
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

      {/* Animation styles */}
      <style>
        {`
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        `}
      </style>
    </section>
  );
}
