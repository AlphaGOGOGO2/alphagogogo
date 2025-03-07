
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";
import { type BlogCategory } from "@/config/navigation";

interface BlogDropdownProps {
  isScrolled: boolean;
  isActive: boolean;
  categories: BlogCategory[];
  onCategoryClick?: () => void;
}

export function BlogDropdown({ isScrolled, isActive, categories, onCategoryClick }: BlogDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
    if (e.key === 'Enter' || e.key === ' ') {
      setIsDropdownOpen((prev) => !prev);
    }
  };
  
  // Add a timer variable for better control of the dropdown closing
  let closeTimer: ReturnType<typeof setTimeout>;
  
  const handleMouseLeave = () => {
    // Use a longer delay (500ms) to prevent accidental closing
    closeTimer = setTimeout(() => setIsDropdownOpen(false), 500);
  };
  
  const handleMouseEnter = () => {
    // Clear the timer if mouse re-enters the dropdown area
    if (closeTimer) {
      clearTimeout(closeTimer);
    }
  };
  
  return (
    <div 
      className="relative inline-block"
      ref={dropdownRef}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onKeyDown={handleKeyDown}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        onMouseEnter={() => setIsDropdownOpen(true)}
        className="inline-flex items-center"
      >
        <NavLink 
          name="블로그"
          path="/blog"
          isScrolled={isScrolled}
          isActive={isActive}
          iconRight={
            <ChevronDown 
              size={16} 
              className={cn(
                "transition-transform duration-300", 
                isDropdownOpen ? "rotate-180" : "rotate-0",
                isScrolled ? "text-purple-700" : "text-white/80"
              )}
              aria-hidden="true"
            /> 
          }
        />
      </div>
      
      {/* Dropdown Menu */}
      <div 
        className={cn(
          "absolute z-50 left-0 mt-1 min-w-48 w-max rounded-md shadow-lg overflow-hidden transition-all duration-200 origin-top-left",
          isDropdownOpen 
            ? "transform scale-100 opacity-100" 
            : "transform scale-95 opacity-0 pointer-events-none",
          isScrolled 
            ? "bg-white border border-gray-200" 
            : "bg-black/40 backdrop-blur-lg border border-white/20"
        )}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="blog-menu"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Increase padding to create larger hit area */}
        <div className="py-2">
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className={cn(
                "block px-6 py-3 text-sm transition-colors duration-150 whitespace-nowrap",
                isScrolled 
                  ? "text-gray-700 hover:bg-purple-50 hover:text-purple-700" 
                  : "text-white/90 hover:bg-white/20 hover:text-white"
              )}
              onClick={() => {
                // Don't close dropdown when clicking category
                // This allows users to quickly navigate between categories
                onCategoryClick?.();
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
