
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 px-6 md:px-8",
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-md" 
          : "bg-gradient-to-r from-[#1A1F2C]/90 via-[#7E69AB]/90 to-[#403E43]/90 backdrop-blur-lg border-b border-white/10"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-heading text-xl md:text-2xl font-semibold group"
        >
          <div className="relative w-8 h-8 md:w-10 md:h-10 overflow-hidden rounded-lg group-hover:scale-105 transition-transform duration-300">
            <img 
              src="https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png" 
              alt="알파블로그 로고" 
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className={cn(
            "bg-clip-text text-transparent bg-gradient-to-r transition-all duration-300",
            isScrolled 
              ? "from-[#6E59A5] to-[#9b87f5]" 
              : "from-white to-purple-200"
          )}>알파블로그</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {[
            { name: "홈", path: "/" },
            { name: "블로그", path: "/blog" },
            { name: "GPTS 이용하기", path: "/gpts" },
            { name: "다운로드", path: "/downloads" },
            { name: "커뮤니티", path: "/community" }
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "text-base md:text-lg font-medium relative transition-all duration-300 px-2 py-1 rounded-md group",
                isScrolled 
                  ? "text-[#4a148c] hover:text-[#4a148c]/80" 
                  : "text-white/90 hover:text-white",
                location.pathname === item.path && "nav-active"
              )}
            >
              <span className="relative z-10">{item.name}</span>
              <span className={cn(
                "absolute bottom-0 left-0 w-full h-1 transform origin-left transition-transform duration-300",
                isScrolled ? "bg-purple-700" : "bg-purple-300",
                location.pathname === item.path 
                  ? "scale-x-100" 
                  : "scale-x-0 group-hover:scale-x-100"
              )}></span>
            </Link>
          ))}
          
          <div className="flex items-center gap-3">
            <Link
              to="/trending"
              className={cn(
                "flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-300",
                isScrolled 
                  ? "text-purple-800 bg-purple-100 hover:bg-purple-200" 
                  : "text-white/90 bg-white/10 hover:bg-white/20"
              )}
            >
              <TrendingUp size={14} className="animate-pulse-slow" />
              <span>인기</span>
            </Link>
            
            <button 
              className={cn(
                "p-2 rounded-full transition-all duration-300 hover:rotate-12",
                isScrolled 
                  ? "bg-gray-100 text-purple-800 hover:bg-gray-200" 
                  : "bg-white/10 text-white hover:bg-white/20"
              )}
            >
              <Search size={18} />
            </button>
          </div>
        </nav>
        
        <button 
          className={cn(
            "md:hidden p-2 rounded-full transition-colors duration-300",
            isScrolled 
              ? "text-purple-800 hover:bg-gray-100" 
              : "text-white hover:bg-white/10"
          )}
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={20} /> 
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-white/95 backdrop-blur-md z-50 transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <Link to="/" className="flex items-center gap-2 font-heading text-xl font-semibold" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="relative w-8 h-8 overflow-hidden rounded-lg">
              <img 
                src="https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png" 
                alt="알파블로그 로고" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-400">알파블로그</span>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={20} className="text-purple-800" />
          </button>
        </div>
        
        <nav className="flex flex-col p-6 space-y-4">
          {[
            { name: "홈", path: "/" },
            { name: "블로그", path: "/blog" },
            { name: "GPTS 이용하기", path: "/gpts" },
            { name: "다운로드", path: "/downloads" },
            { name: "커뮤니티", path: "/community" }
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "text-xl font-medium text-purple-800 p-2 rounded-md transition-all duration-300 relative",
                location.pathname === item.path 
                  ? "bg-purple-50 pl-4" 
                  : "hover:bg-purple-50/50 hover:pl-4"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
              {location.pathname === item.path && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-purple-700 rounded-r-full" />
              )}
            </Link>
          ))}
          
          <Link
            to="/trending"
            className="flex items-center gap-2 text-purple-800 bg-purple-50 p-3 rounded-md hover:bg-purple-100 transition-colors mt-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <TrendingUp size={18} className="text-purple-600" />
            <span className="font-medium">인기 콘텐츠 보기</span>
          </Link>
          
          <div className="relative mt-6">
            <input 
              type="text" 
              placeholder="검색..." 
              className="w-full bg-gray-100 rounded-lg py-3 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </nav>
      </div>
    </header>
  );
}
