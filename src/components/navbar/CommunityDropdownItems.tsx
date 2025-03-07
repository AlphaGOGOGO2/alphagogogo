
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { type CommunityCategory } from "@/config/navigation";
import { CommunityIcon } from "./CommunityIcon";

interface CommunityDropdownItemsProps {
  categories: CommunityCategory[];
  isScrolled: boolean;
  onItemClick: (category: CommunityCategory, event: React.MouseEvent) => void;
}

export function CommunityDropdownItems({ 
  categories, 
  isScrolled, 
  onItemClick 
}: CommunityDropdownItemsProps) {
  return (
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
            onClick={(e) => {
              e.stopPropagation(); // 이벤트 버블링 방지
              onItemClick(category, e);
            }}
            type="button"
            role="menuitem"
          >
            <CommunityIcon categoryName={category.name} />
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
            onClick={(e) => {
              e.stopPropagation(); // 이벤트 버블링 방지
              onItemClick(category, e);
            }}
            role="menuitem"
          >
            <CommunityIcon categoryName={category.name} />
            {category.name}
          </Link>
        )
      ))}
    </div>
  );
}
