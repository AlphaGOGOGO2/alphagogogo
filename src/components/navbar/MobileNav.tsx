
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavbarLogo } from "./NavbarLogo";
import { MobileNavLink } from "./MobileNavLink";
import { mainNavItems, blogCategories } from "@/config/navigation";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const location = useLocation();
  
  return (
    <div 
      className={cn(
        "fixed inset-0 bg-white/95 backdrop-blur-md z-50 transform transition-all duration-300 ease-in-out",
        isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
      )}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      <div className="flex justify-between items-center p-6 border-b">
        <NavbarLogo isScrolled={true} onClick={onClose} />
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Close navigation menu"
        >
          <X size={20} className="text-purple-800" />
        </button>
      </div>
      
      <nav className="flex flex-col p-6 space-y-4 animate-fade-in">
        <MobileNavLink 
          name="홈" 
          path="/" 
          isActive={location.pathname === "/"} 
          onClick={onClose}
        />
        <MobileNavLink 
          name="블로그" 
          path="/blog" 
          isActive={location.pathname.startsWith("/blog")}
          onClick={onClose}
        />
        
        {/* Mobile Blog Categories */}
        <div className="pl-6 space-y-2">
          {location.pathname.startsWith("/blog") && 
            blogCategories.map((category) => (
              <MobileNavLink
                key={category.path}
                name={`- ${category.name}`}
                path={category.path}
                isActive={location.pathname === category.path}
                onClick={onClose}
              />
            ))
          }
        </div>
        
        {mainNavItems.slice(1).map((item) => (
          <MobileNavLink 
            key={item.path}
            name={item.name} 
            path={item.path} 
            isActive={location.pathname === item.path}
            onClick={onClose}
            isExternal={item.isExternal}
          />
        ))}
      </nav>
    </div>
  );
}
