
import { useLocation } from "react-router-dom";
import { Youtube } from "lucide-react";
import { NavLink } from "./NavLink";
import { BlogDropdown } from "./BlogDropdown";

interface DesktopNavProps {
  isScrolled: boolean;
  blogCategories: Array<{ name: string; path: string }>;
}

export function DesktopNav({ isScrolled, blogCategories }: DesktopNavProps) {
  const location = useLocation();
  
  return (
    <nav className="hidden md:flex items-center gap-8">
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
      
      {[
        { name: "GPTS 이용하기", path: "/gpts" },
        { name: "서비스", path: "/services" },
        { name: "유튜브", path: "/youtube", icon: <Youtube size={16} className="inline-block ml-2 text-purple-600" /> },
        { name: "커뮤니티", path: "/community" }
      ].map((item) => (
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
