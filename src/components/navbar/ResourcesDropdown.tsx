
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ResourcesCategory } from "@/config/navigation";

interface ResourcesDropdownProps {
  isScrolled: boolean;
  isActive: boolean;
  categories: ResourcesCategory[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResourcesDropdown({ 
  isScrolled, 
  isActive, 
  categories, 
  isOpen, 
  onOpenChange 
}: ResourcesDropdownProps) {
  const triggerClasses = cn(
    "text-base md:text-lg font-medium relative transition-all duration-300 px-3 py-2 rounded-md group flex items-center bg-transparent border-none cursor-pointer",
    isScrolled 
      ? "text-purple-900 hover:text-purple-800" 
      : "text-white/90 hover:text-white"
  );

  const underlineClasses = cn(
    "absolute bottom-0 left-0 w-full h-1 transform origin-left transition-transform duration-300",
    isScrolled ? "bg-purple-600" : "bg-purple-400",
    isActive 
      ? "scale-x-100" 
      : "scale-x-0 group-hover:scale-x-100"
  );

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger 
            className={triggerClasses}
            onPointerEnter={() => onOpenChange(true)}
            onPointerLeave={() => onOpenChange(false)}
          >
            <div className="relative z-10 flex items-center">
              <span>자료실</span>
              <ChevronDown 
                size={16} 
                className={cn(
                  "ml-1 transition-transform duration-200",
                  isOpen ? "rotate-180" : ""
                )} 
              />
            </div>
            <span 
              className={underlineClasses}
              aria-hidden="true"
            />
          </NavigationMenuTrigger>
          <NavigationMenuContent 
            className="w-80 p-6 bg-white shadow-lg border border-gray-200"
            onPointerEnter={() => onOpenChange(true)}
            onPointerLeave={() => onOpenChange(false)}
          >
            <div className="grid gap-3">
              {categories.map((category) => (
                <NavigationMenuLink key={category.name} asChild>
                  <Link
                    to={category.path}
                    className="block p-3 rounded-lg hover:bg-purple-50 transition-colors group"
                  >
                    <div className="font-medium text-gray-900 group-hover:text-purple-700 mb-1">
                      {category.name}
                    </div>
                    <p className="text-sm text-gray-600 group-hover:text-purple-600">
                      {category.description}
                    </p>
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
