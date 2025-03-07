
import { useLocation } from "react-router-dom";
import { NavLink } from "./NavLink";
import { BlogDropdown } from "./BlogDropdown";
import { GPTSDropdown } from "./GPTSDropdown";
import { mainNavItems, blogCategories, gptsCategories } from "@/config/navigation";

interface DesktopNavProps {
  isScrolled: boolean;
}

export function DesktopNav({ isScrolled }: DesktopNavProps) {
  const location = useLocation();
  
  const filteredMainNavItems = mainNavItems.filter(
    item => item.name !== "홈" && item.name !== "GPTS 이용하기"
  );
  
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
      
      <GPTSDropdown 
        isScrolled={isScrolled}
        isActive={location.pathname === "/gpts"}
        categories={gptsCategories}
      />
      
      {filteredMainNavItems.map((item) => (
        <NavLink
          key={item.name}
          name={item.name}
          path={item.path}
          isScrolled={isScrolled}
          isActive={location.pathname === item.path}
          isExternal={item.isExternal}
        />
      ))}
    </nav>
  );
}
