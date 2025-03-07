
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";
import { type GPTSCategory } from "@/config/navigation";

interface GPTSDropdownProps {
  isScrolled: boolean;
  isActive: boolean;
  categories: GPTSCategory[];
  onCategoryClick?: () => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function GPTSDropdown({ 
  isScrolled, 
  isActive, 
  categories, 
  onCategoryClick,
  isOpen,
  onOpenChange
}: GPTSDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  
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
          name="GPTS 이용하기"
          path="/gpts"
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
        aria-labelledby="gpts-menu"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="py-2">
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className={cn(
                "block px-6 py-3 text-sm transition-colors duration-150 whitespace-nowrap",
                isScrolled 
                  ? "text-gray-700 hover:bg-purple-50 hover:text-purple-700" 
                  : "text-white hover:bg-white/20 hover:text-white"
              )}
              onClick={() => {
                onCategoryClick?.();
                onOpenChange(false);
              }}
              role="menuitem"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
