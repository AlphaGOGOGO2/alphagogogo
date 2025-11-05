
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavbarLogo } from "./NavbarLogo";
import { MobileNavLink } from "./MobileNavLink";
import { mainNavItems, servicesCategories, NavItem } from "@/config/navigation";
import { MobileBlogItems } from "./MobileBlogItems";
import { MobileCommunityItems } from "./MobileCommunityItems";
import { toast } from "sonner";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if current path is a service page
  const isServicePage = servicesCategories.some(service => 
    location.pathname === service.path || location.pathname === "/services"
  );

  const handleNavLinkClick = (item: NavItem) => {
    if (item.isComingSoon) {
      toast("준비중입니다", {
        description: "해당 기능은 곧 제공될 예정입니다.",
        position: "top-center"
      });
      navigate("/");
      onClose();
      return false;
    }
    
    onClose();
    return true;
  };
  
  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 bottom-0 bg-white shadow-lg z-[9999] transform transition-all duration-300 ease-in-out flex flex-col",
        "h-screen w-screen overflow-hidden",
        isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
      )}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
      style={{ height: '100vh', height: '100dvh' }}
    >
      <div className="flex justify-between items-center p-4 sm:p-6 border-b bg-white flex-shrink-0 min-h-[60px]">
        <NavbarLogo isScrolled={true} onClick={onClose} />
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Close navigation menu"
        >
          <X size={20} className="text-purple-800" />
        </button>
      </div>

      <nav className="flex flex-col p-4 sm:p-6 space-y-2 sm:space-y-4 bg-white overflow-y-auto flex-1 pb-safe">
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
          path="/open-chat-rooms"
          isActive={location.pathname === "/open-chat-rooms" || location.pathname === "/business-inquiry"}
          onClick={onClose}
        />

        <MobileCommunityItems
          onClose={onClose}
          locationPathname={location.pathname}
        />

        <MobileNavLink
          name="서비스"
          path="/services"
          isActive={isServicePage}
          onClick={onClose}
        />

        {mainNavItems.filter(item =>
          item.name !== "홈" &&
          item.name !== "커뮤니티" &&
          item.name !== "서비스"
        ).map((item) => (
          <MobileNavLink
            key={item.path}
            name={item.name}
            path={item.path}
            isActive={location.pathname === item.path}
            onClick={() => handleNavLinkClick(item)}
            isExternal={item.isExternal}
            isSparkle={item.isSparkle}
          />
        ))}
      </nav>
    </div>
  );
}
