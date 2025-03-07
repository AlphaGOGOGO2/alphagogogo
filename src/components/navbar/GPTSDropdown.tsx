
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

  // Console log to debug dropdown state
  console.log("GPTS dropdown isOpen:", isOpen);

  return (
    <div 
      className="relative inline-block"
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()} // Stop propagation at container level
    >
      <button
        type="button" 
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpenChange(!isOpen);
          console.log("GPTS dropdown clicked, new state:", !isOpen);
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
                onClick={(e) => {
                  e.stopPropagation();
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
      )}
    </div>
  );
}
