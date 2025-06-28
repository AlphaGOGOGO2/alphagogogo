
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";
import { type BlogCategory } from "@/config/navigation";
import { useDropdown } from "@/hooks/useDropdown";

interface BlogDropdownProps {
  isScrolled: boolean;
  isActive: boolean;
  categories: BlogCategory[];
  onCategoryClick?: () => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function BlogDropdown({ 
  isScrolled, 
  isActive, 
  categories, 
  onCategoryClick,
  isOpen,
  onOpenChange
}: BlogDropdownProps) {
  const { dropdownRef, handlers } = useDropdown({
    closeDelay: 300,
    openOnHover: true,
    closeOnClick: true
  });

  return (
    <div 
      className="relative inline-block"
      ref={dropdownRef}
      onMouseEnter={() => {
        handlers.onMouseEnter();
        onOpenChange(true);
      }}
      onMouseLeave={() => {
        handlers.onMouseLeave();
        onOpenChange(false);
      }}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={(e) => {
          handlers.onClick(e);
          onOpenChange(!isOpen);
        }}
        className="inline-flex items-center focus:outline-none"
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
          aria-labelledby="blog-menu"
          onClick={(e) => e.stopPropagation()}
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
                  handlers.onItemClick();
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
