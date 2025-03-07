import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavbarLogo } from "./NavbarLogo";
import { MobileNavLink } from "./MobileNavLink";
import { mainNavItems, blogCategories, communityCategories } from "@/config/navigation";
import { openInfoPopup } from "@/utils/popupUtils";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleCommunityItemClick = (category: typeof communityCategories[0], event: React.MouseEvent) => {
    onClose();
    
    // 일반 링크 클릭은 기본 동작 그대로 유지
    if (!category.action) {
      navigate(category.path);
      return;
    }
    
    // 팝업 액션이 있는 경우 기본 동작 중단
    event.preventDefault();
    
    if (category.action === 'popup' && category.actionData) {
      const title = category.name === "오픈 채팅방" ? "오픈 채팅방 입장 안내" : "비즈니스 문의 안내";
      const action = category.name === "오픈 채팅방" ? 'link' : 'email';
      
      // 팝업 열기 시도
      const isPopupOpened = openInfoPopup({
        title,
        message: category.actionData,
        action,
        actionData: category.path
      });
      
      // 팝업이 차단된 경우 직접 이동
      if (!isPopupOpened) {
        window.location.href = category.path;
      }
    }
  };
  
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

        <MobileNavLink 
          name="커뮤니티" 
          path="/community" 
          isActive={location.pathname === "/community"}
          onClick={onClose}
        />
        
        <div className="pl-6 space-y-2">
          {communityCategories.map((category) => (
            category.action === 'popup' ? (
              <button
                key={category.path}
                className="text-xl font-medium text-blue-800 p-2 rounded-md transition-all duration-300 relative flex items-center hover:bg-blue-50/50 hover:pl-4 w-full text-left"
                onClick={(e) => handleCommunityItemClick(category, e)}
              >
                - {category.name}
              </button>
            ) : (
              <MobileNavLink
                key={category.path}
                name={`- ${category.name}`}
                path={category.path}
                isActive={location.pathname === category.path && category.name === "실시간 채팅"}
                onClick={onClose}
              />
            )
          ))}
        </div>
        
        {mainNavItems.filter(item => item.name !== "홈" && item.name !== "커뮤니티").map((item) => (
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
