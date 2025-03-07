
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "./NavLink";
import { BlogDropdown } from "./BlogDropdown";
import { GPTSDropdown } from "./GPTSDropdown";
import { CommunityDropdown } from "./CommunityDropdown";
import { mainNavItems, blogCategories, gptsCategories, communityCategories, servicesCategories } from "@/config/navigation";

interface DesktopNavProps {
  isScrolled: boolean;
}

export function DesktopNav({ isScrolled }: DesktopNavProps) {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState<"blog" | "gpts" | "community" | null>(null);
  
  // Check if current path is a service page
  const isServicePage = servicesCategories.some(service => 
    location.pathname === service.path || location.pathname === "/services"
  );
  
  const filteredMainNavItems = mainNavItems.filter(
    item => item.name !== "홈" && item.name !== "GPTS 이용하기" && item.name !== "커뮤니티"
  );
  
  const handleBlogDropdownChange = (isOpen: boolean) => {
    setActiveDropdown(isOpen ? "blog" : null);
  };
  
  const handleGPTSDropdownChange = (isOpen: boolean) => {
    setActiveDropdown(isOpen ? "gpts" : null);
  };

  const handleCommunityDropdownChange = (isOpen: boolean) => {
    setActiveDropdown(isOpen ? "community" : null);
  };

  // Close dropdowns when route changes
  useEffect(() => {
    setActiveDropdown(null);
  }, [location.pathname]);
  
  return (
    <nav 
      className="hidden md:flex items-center gap-6" 
    >
      <NavLink 
        name="홈" 
        path="/" 
        isScrolled={isScrolled} 
        isActive={location.pathname === "/"}
      />
      
      <BlogDropdown 
        isScrolled={isScrolled}
        isActive={location.pathname.startsWith("/blog") && !isServicePage}
        categories={blogCategories}
        isOpen={activeDropdown === "blog"}
        onOpenChange={handleBlogDropdownChange}
      />
      
      <GPTSDropdown 
        isScrolled={isScrolled}
        isActive={location.pathname === "/gpts"}
        categories={gptsCategories}
        isOpen={activeDropdown === "gpts"}
        onOpenChange={handleGPTSDropdownChange}
      />

      <CommunityDropdown
        isScrolled={isScrolled}
        isActive={location.pathname === "/community"}
        categories={communityCategories}
        isOpen={activeDropdown === "community"}
        onOpenChange={handleCommunityDropdownChange}
      />
      
      {filteredMainNavItems.map((item) => (
        <NavLink
          key={item.name}
          name={item.name}
          path={item.path}
          isScrolled={isScrolled}
          isActive={item.name === "서비스" ? isServicePage : location.pathname === item.path}
          isExternal={item.isExternal}
        />
      ))}
    </nav>
  );
}

