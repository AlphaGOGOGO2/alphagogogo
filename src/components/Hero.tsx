
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient"></div>
      
      {/* Animated shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-16 right-[10%] w-64 h-64 rounded-full bg-purple-400/20 blur-3xl animate-float"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-purple-300/20 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[20%] w-40 h-40 rounded-full bg-purple-500/20 blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 md:px-8 pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col items-center justify-center text-center z-10">
        <div className="stagger-animation">
          <div className="inline-block mb-6 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 animate-fade-in">
            <span className="text-white/90 text-sm font-medium">The Future of AI - Simplified</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight animate-fade-in max-w-4xl mx-auto text-balance">
            Explore the Latest Innovations in <span className="relative">Artificial Intelligence
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-white/30 rounded-full"></div>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-fade-in text-balance">
            Stay ahead of the curve with our curated insights on breakthrough AI technologies, research, and applications transforming our world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <button className="animated-button px-6 py-3 rounded-lg bg-white text-purple-800 font-medium hover:bg-white/95 transition-all transform hover:-translate-y-0.5">
              Explore Latest Articles
            </button>
            <button className="animated-button px-6 py-3 rounded-lg bg-purple-500/20 backdrop-blur-sm text-white border border-white/20 font-medium hover:bg-purple-500/30 transition-all flex items-center justify-center gap-2">
              Subscribe to Newsletter
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
        
        {/* Scrolling indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-pulse-slow">
          <div className="w-1 h-10 rounded-full relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/50"></div>
            <div className="absolute top-0 left-0 right-0 h-5 bg-white animate-[pulse_1.5s_ease-in-out_infinite]"></div>
          </div>
          <span className="text-white/70 text-xs mt-2">Scroll Down</span>
        </div>
      </div>
    </section>
  );
}
