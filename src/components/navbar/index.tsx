
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavbarLogo } from "./NavbarLogo";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";

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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 px-6 md:px-8",
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-md" 
          : "bg-gradient-to-r from-[#1A1F2C]/90 via-[#7E69AB]/90 to-[#403E43]/90 backdrop-blur-lg border-b border-white/10"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <NavbarLogo isScrolled={isScrolled} />
        
        <DesktopNav isScrolled={isScrolled} />
        
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
      
      <MobileNav 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
}
