
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-8",
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-heading text-xl md:text-2xl font-semibold"
        >
          <div className="relative">
            <Zap size={24} className="text-purple-600" />
          </div>
          <span className={cn(
            "transition-colors duration-300",
            isScrolled ? "text-foreground" : "text-white"
          )}>AI.Pulse</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {["Home", "News", "Topics", "About"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className={cn(
                "text-sm font-medium relative transition-colors duration-300 hover:text-purple-600",
                "after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0.5 after:bg-purple-600 after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left",
                isScrolled ? "text-foreground" : "text-white"
              )}
            >
              {item}
            </Link>
          ))}
          <button 
            className={cn(
              "p-2 rounded-full transition-colors duration-300",
              isScrolled ? "hover:bg-purple-100 text-foreground" : "hover:bg-white/10 text-white"
            )}
          >
            <Search size={18} />
          </button>
        </nav>
        
        <button 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu 
            size={24} 
            className={cn(
              "transition-colors duration-300",
              isScrolled ? "text-foreground" : "text-white"
            )} 
          />
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-between items-center p-6">
          <Link to="/" className="flex items-center gap-2 font-heading text-xl font-semibold">
            <Zap size={24} className="text-purple-600" />
            <span>AI.Pulse</span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} className="text-foreground" />
          </button>
        </div>
        
        <nav className="flex flex-col p-6 space-y-6">
          {["Home", "News", "Topics", "About"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="text-lg font-medium hover:text-purple-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <div className="relative mt-6">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-gray-100 rounded-lg py-3 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </nav>
      </div>
    </header>
  );
}
