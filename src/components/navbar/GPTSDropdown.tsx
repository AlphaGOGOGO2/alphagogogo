
import { useRef, useState, useEffect } from "react";
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
  const [closeTimeout, setCloseTimeout] = useState<number | null>(null);
  
  // 마우스 이벤트 핸들러 개선
  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    onOpenChange(true);
  };

  const handleMouseLeave = () => {
    const timeout = window.setTimeout(() => {
      onOpenChange(false);
    }, 300); // 300ms 지연시간 추가
    
    setCloseTimeout(timeout as unknown as number);
  };

  // 컴포넌트 언마운트 시 타임아웃 정리
  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  // Handle scrolling to section when clicking on an anchor link
  const handleSectionClick = (sectionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    // Close the dropdown
    onOpenChange(false);
    onCategoryClick?.();
    
    // If we're already on the GPTS page, scroll to the section
    if (window.location.pathname === '/gpts') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to the GPTS page with the hash in the URL
      window.location.href = `/gpts#${sectionId}`;
    }
  };

  return (
    <div 
      className="relative inline-block"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpenChange(!isOpen);
        }}
        className="inline-flex items-center focus:outline-none"
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
      </button>
      
      {isOpen && (
        <div 
          className={cn(
            "absolute z-50 left-0 mt-1 min-w-48 w-max rounded-md shadow-lg overflow-hidden",
            isScrolled 
              ? "bg-white border border-gray-200" 
              : "bg-black/80 backdrop-blur-lg border border-white/20"
          )}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="gpts-menu"
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="py-2">
            {categories.map((category) => {
              // Extract the section ID from the path (e.g., "/gpts#blog" -> "blog")
              const sectionId = category.path.split('#')[1];
              
              return (
                <a
                  key={category.path}
                  href={category.path}
                  className={cn(
                    "block px-6 py-3 text-sm transition-colors duration-150 whitespace-nowrap",
                    isScrolled 
                      ? "text-gray-700 hover:bg-purple-50 hover:text-purple-700" 
                      : "text-white hover:bg-white/20 hover:text-white"
                  )}
                  onClick={(e) => handleSectionClick(sectionId, e)}
                  role="menuitem"
                >
                  {category.name}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
