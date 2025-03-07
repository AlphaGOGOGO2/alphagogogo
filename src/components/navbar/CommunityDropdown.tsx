import { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, MessageCircle, ExternalLink, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";
import { type CommunityCategory } from "@/config/navigation";
import { useToast } from "@/hooks/use-toast";
import { openInfoPopup } from "@/utils/popupUtils";

interface CommunityDropdownProps {
  isScrolled: boolean;
  isActive: boolean;
  categories: CommunityCategory[];
  onOpenChange: (isOpen: boolean) => void;
  isOpen: boolean;
}

export function CommunityDropdown({ 
  isScrolled, 
  isActive, 
  categories,
  isOpen,
  onOpenChange
}: CommunityDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onOpenChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false);
    }
    if (e.key === 'Enter' || e.key === ' ') {
      onOpenChange(!isOpen);
    }
  };

  let closeTimer: ReturnType<typeof setTimeout>;
  
  const handleMouseLeave = () => {
    closeTimer = setTimeout(() => onOpenChange(false), 300);
  };
  
  const handleMouseEnter = () => {
    if (closeTimer) {
      clearTimeout(closeTimer);
    }
  };

  const handleCategoryClick = (category: CommunityCategory, event: React.MouseEvent) => {
    onOpenChange(false);
    
    if (!category.action) {
      navigate(category.path);
      return;
    }
    
    event.preventDefault();
    
    if (category.action === 'popup' && category.actionData) {
      const title = category.name === "오픈 채팅방" ? "오픈 채팅방 입장 안내" : "비즈니스 문의 안내";
      const action = category.name === "오픈 채팅방" ? 'link' : 'email';
      
      const isPopupOpened = openInfoPopup({
        title,
        message: category.actionData,
        action,
        actionData: category.path
      });
      
      if (!isPopupOpened) {
        window.location.href = category.path;
      }
    }
  };
  
  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case "실시간 채팅":
        return <MessageCircle size={16} />;
      case "오픈 채팅방":
        return <ExternalLink size={16} />;
      case "비즈니스 문의":
        return <Mail size={16} />;
      default:
        return null;
    }
  };
  
  return (
    <div 
      className="relative inline-block"
      ref={dropdownRef}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => {
        handleMouseEnter();
        onOpenChange(true);
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => onOpenChange(!isOpen)}
        onMouseEnter={() => onOpenChange(true)}
        className="inline-flex items-center"
      >
        <NavLink 
          name="커뮤니티"
          path="/community"
          isScrolled={isScrolled}
          isActive={isActive}
          iconRight={
            <ChevronDown 
              size={16} 
              className={cn(
                "transition-transform duration-300", 
                isOpen ? "rotate-180" : "rotate-0",
                isScrolled ? "text-purple-700" : "text-white/80"
              )}
              aria-hidden="true"
            /> 
          }
        />
      </div>
      
      <div 
        className={cn(
          "absolute z-50 left-0 mt-1 min-w-48 w-max rounded-md shadow-lg overflow-hidden transition-all duration-200 origin-top-left",
          isOpen 
            ? "transform scale-100 opacity-100" 
            : "transform scale-95 opacity-0 pointer-events-none",
          isScrolled 
            ? "bg-white border border-gray-200" 
            : "bg-black/80 backdrop-blur-lg border border-white/20"
        )}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="community-menu"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="py-2">
          {categories.map((category) => (
            category.action === 'popup' ? (
              <button
                key={category.path}
                className={cn(
                  "block w-full text-left px-6 py-3 text-sm transition-colors duration-150 whitespace-nowrap flex items-center gap-2",
                  isScrolled 
                    ? "text-gray-700 hover:bg-purple-50 hover:text-purple-700" 
                    : "text-white hover:bg-white/20 hover:text-white"
                )}
                onClick={(e) => handleCategoryClick(category, e)}
                role="menuitem"
              >
                {getCategoryIcon(category.name)}
                {category.name}
              </button>
            ) : (
              <Link
                key={category.path}
                to={category.path}
                className={cn(
                  "block px-6 py-3 text-sm transition-colors duration-150 whitespace-nowrap flex items-center gap-2",
                  isScrolled 
                    ? "text-gray-700 hover:bg-purple-50 hover:text-purple-700" 
                    : "text-white hover:bg-white/20 hover:text-white"
                )}
                onClick={(e) => handleCategoryClick(category, e)}
                role="menuitem"
              >
                {getCategoryIcon(category.name)}
                {category.name}
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
