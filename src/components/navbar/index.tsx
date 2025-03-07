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

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 px-6 md:px-8",
        isScrolled 
          ? "bg-white shadow-md" 
          : "bg-gradient-to-r from-[#0EA5E9] via-[#1E40AF] to-[#0EA5E9] backdrop-blur-lg border-b border-white/10"
      )}
      role="banner"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <NavbarLogo isScrolled={isScrolled} />
        
        <DesktopNav isScrolled={isScrolled} />
        
        <button 
          className={cn(
            "md:hidden p-2 rounded-full transition-colors duration-300",
            isScrolled 
              ? "text-blue-800 hover:bg-gray-100" 
              : "text-white hover:bg-white/10"
          )}
          onClick={() => setIsMobileMenuOpen(true)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Open navigation menu"
        >
          <Menu size={20} aria-hidden="true" /> 
        </button>
      </div>
      
      <MobileNav 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
}
