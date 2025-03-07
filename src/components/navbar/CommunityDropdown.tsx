
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";
import { type CommunityCategory } from "@/config/navigation";
import { openInfoPopup } from "@/utils/popupUtils";
import { CommunityDropdownItems } from "./CommunityDropdownItems";

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
  
  return (
    <div 
      className="relative inline-block"
      ref={dropdownRef}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => onOpenChange(!isOpen)}
        onMouseEnter={() => onOpenChange(true)}
        className="inline-flex items-center focus:outline-none"
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
      </button>
      
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
        onMouseLeave={() => onOpenChange(false)}
      >
        <CommunityDropdownItems 
          categories={categories} 
          isScrolled={isScrolled} 
          onItemClick={handleCategoryClick}
        />
      </div>
    </div>
  );
}
