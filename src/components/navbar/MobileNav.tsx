
import { useLocation } from "react-router-dom";
import { X, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavbarLogo } from "./NavbarLogo";
import { MobileNavLink } from "./MobileNavLink";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  blogCategories: Array<{ name: string; path: string }>;
}

export function MobileNav({ isOpen, onClose, blogCategories }: MobileNavProps) {
  const location = useLocation();
  
  return (
    <div 
      className={cn(
        "fixed inset-0 bg-white/95 backdrop-blur-md z-50 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex justify-between items-center p-6 border-b">
        <NavbarLogo isScrolled={true} onClick={onClose} />
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <X size={20} className="text-purple-800" />
        </button>
      </div>
      
      <nav className="flex flex-col p-6 space-y-4">
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
                key={category.name}
                name={`- ${category.name}`}
                path={category.path}
                isActive={location.pathname === category.path}
                onClick={onClose}
              />
            ))
          }
        </div>
        
        <MobileNavLink 
          name="GPTS 이용하기" 
          path="/gpts" 
          isActive={location.pathname === "/gpts"}
          onClick={onClose}
        />
        <MobileNavLink 
          name="서비스" 
          path="/services" 
          isActive={location.pathname === "/services"}
          onClick={onClose}
        />
        <MobileNavLink 
          name="유튜브" 
          path="/youtube" 
          isActive={location.pathname === "/youtube"}
          onClick={onClose}
          iconRight={<Youtube size={16} className="inline-block ml-2 text-purple-600" />}
        />
        <MobileNavLink 
          name="커뮤니티" 
          path="/community" 
          isActive={location.pathname === "/community"}
          onClick={onClose}
        />
      </nav>
    </div>
  );
}
