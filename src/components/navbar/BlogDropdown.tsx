
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";

interface BlogCategory {
  name: string;
  path: string;
}

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
  
  return (
    <div 
      className="relative"
      ref={dropdownRef}
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}
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
              "ml-1 transition-transform duration-300", 
              isDropdownOpen ? "rotate-180" : "rotate-0",
              isScrolled ? "text-purple-700" : "text-white/80"
            )} 
          />
        }
      />
      
      {/* Dropdown Menu */}
      <div 
        className={cn(
          "absolute top-full left-0 mt-1 w-48 rounded-md shadow-lg overflow-hidden transition-all duration-200 origin-top-left",
          isDropdownOpen 
            ? "transform scale-100 opacity-100" 
            : "transform scale-95 opacity-0 pointer-events-none",
          isScrolled 
            ? "bg-white border border-gray-200" 
            : "bg-white/10 backdrop-blur-lg border border-white/20"
        )}
      >
        <div className="py-1">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className={cn(
                "block px-4 py-2 text-sm transition-colors duration-150",
                isScrolled 
                  ? "text-gray-700 hover:bg-purple-50 hover:text-purple-700" 
                  : "text-white/90 hover:bg-white/20 hover:text-white"
              )}
              onClick={onCategoryClick}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
