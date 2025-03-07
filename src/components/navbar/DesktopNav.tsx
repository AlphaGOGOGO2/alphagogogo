
import { useLocation } from "react-router-dom";
import { Youtube } from "lucide-react";
import { NavLink } from "./NavLink";
import { BlogDropdown } from "./BlogDropdown";
import { mainNavItems, blogCategories, type BlogCategory } from "@/config/navigation";

interface DesktopNavProps {
  isScrolled: boolean;
}

export function DesktopNav({ isScrolled }: DesktopNavProps) {
  const location = useLocation();
  
  return (
    <nav className="hidden md:flex items-center gap-6">
      <NavLink 
        name="홈" 
        path="/" 
        isScrolled={isScrolled} 
        isActive={location.pathname === "/"}
      />
      
      <BlogDropdown 
        isScrolled={isScrolled}
        isActive={location.pathname.startsWith("/blog")}
        categories={blogCategories}
      />
      
      {mainNavItems.slice(1).map((item) => (
        <NavLink
          key={item.name}
          name={item.name}
          path={item.path}
          isScrolled={isScrolled}
          isActive={location.pathname === item.path}
          iconRight={item.name === "유튜브" ? <Youtube size={16} className="inline-block ml-2 text-purple-600" /> : undefined}
        />
      ))}
    </nav>
  );
}
