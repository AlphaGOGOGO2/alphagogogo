
import { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "./NavLink";
import { BlogDropdown } from "./BlogDropdown";
import { GPTSDropdown } from "./GPTSDropdown";
import { CommunityDropdown } from "./CommunityDropdown";
import { mainNavItems, blogCategories, gptsCategories, communityCategories } from "@/config/navigation";

interface DesktopNavProps {
  isScrolled: boolean;
}

export function DesktopNav({ isScrolled }: DesktopNavProps) {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState<"blog" | "gpts" | "community" | null>(null);
  
  const filteredMainNavItems = mainNavItems.filter(
    item => item.name !== "홈" && item.name !== "GPTS 이용하기" && item.name !== "커뮤니티"
  );
  
  const handleBlogDropdownChange = useCallback((isOpen: boolean) => {
    console.log("Blog dropdown change callback called with:", isOpen);
    if (isOpen) {
      setActiveDropdown("blog");
    } else if (activeDropdown === "blog") {
      setActiveDropdown(null);
    }
  }, [activeDropdown]);
  
  const handleGPTSDropdownChange = useCallback((isOpen: boolean) => {
    console.log("GPTS dropdown change callback called with:", isOpen);
    if (isOpen) {
      setActiveDropdown("gpts");
    } else if (activeDropdown === "gpts") {
      setActiveDropdown(null);
    }
  }, [activeDropdown]);

  const handleCommunityDropdownChange = useCallback((isOpen: boolean) => {
    console.log("Community dropdown change callback called with:", isOpen);
    if (isOpen) {
      setActiveDropdown("community");
    } else if (activeDropdown === "community") {
      setActiveDropdown(null);
    }
  }, [activeDropdown]);

  // Add click outside handler to close all dropdowns
  useEffect(() => {
    const handleClickOutside = () => {
      if (activeDropdown) {
        setActiveDropdown(null);
      }
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [activeDropdown]);
  
  // Debug current state
  console.log("Current active dropdown:", activeDropdown);
  
  return (
    <nav 
      className="hidden md:flex items-center gap-6" 
      onClick={(e) => e.stopPropagation()}
    >
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
          isActive={location.pathname === item.path}
          isExternal={item.isExternal}
        />
      ))}
    </nav>
  );
}
