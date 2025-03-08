
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavbarLogo } from "./NavbarLogo";
import { MobileNavLink } from "./MobileNavLink";
import { mainNavItems, servicesCategories } from "@/config/navigation";
import { MobileBlogItems } from "./MobileBlogItems";
import { MobileCommunityItems } from "./MobileCommunityItems";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const location = useLocation();
  
  // Check if current path is a service page
  const isServicePage = servicesCategories.some(service => 
    location.pathname === service.path || location.pathname === "/services"
  );
  
  return (
    <div 
      className={cn(
        "fixed inset-0 bg-white shadow-lg z-50 transform transition-all duration-300 ease-in-out",
        isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
      )}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      <div className="flex justify-between items-center p-6 border-b bg-white">
        <NavbarLogo isScrolled={true} onClick={onClose} />
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Close navigation menu"
        >
          <X size={20} className="text-purple-800" />
        </button>
      </div>
      
      <nav className="flex flex-col p-6 space-y-4 animate-fade-in pb-20 bg-white">
        <MobileNavLink 
          name="홈" 
          path="/" 
          isActive={location.pathname === "/"} 
          onClick={onClose}
        />
        <MobileNavLink 
          name="블로그" 
          path="/blog" 
          isActive={location.pathname.startsWith("/blog") && !isServicePage}
          onClick={onClose}
        />
        
        <MobileBlogItems 
          onClose={onClose} 
          locationPathname={location.pathname}
          showCategories={location.pathname.startsWith("/blog") && !isServicePage}
        />

        <MobileNavLink 
          name="커뮤니티" 
          path="/community" 
          isActive={location.pathname === "/community"}
          onClick={onClose}
        />
        
        <MobileCommunityItems 
          onClose={onClose} 
          locationPathname={location.pathname} 
        />
        
        {mainNavItems.filter(item => item.name !== "홈" && item.name !== "커뮤니티").map((item) => (
          <MobileNavLink 
            key={item.path}
            name={item.name} 
            path={item.path} 
            isActive={item.name === "서비스" ? isServicePage : location.pathname === item.path}
            onClick={onClose}
            isExternal={item.isExternal}
          />
        ))}
      </nav>
    </div>
  );
}
