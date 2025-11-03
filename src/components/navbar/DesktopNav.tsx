
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "./NavLink";
import { BlogDropdown } from "./BlogDropdown";
import { GPTSDropdown } from "./GPTSDropdown";
import { CommunityDropdown } from "./CommunityDropdown";
import { ServicesDropdown } from "./ServicesDropdown";
import { mainNavItems, blogCategories, gptsCategories, communityCategories, servicesCategories, NavItem } from "@/config/navigation";
import { toast } from "sonner";

interface DesktopNavProps {
  isScrolled: boolean;
}

export function DesktopNav({ isScrolled }: DesktopNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState<"blog" | "gpts" | "community" | "services" | null>(null);
  
  const isServicePage = servicesCategories.some(service => 
    location.pathname === service.path || location.pathname === "/services"
  );
  
  const filteredMainNavItems = mainNavItems.filter(
    item => item.name === "유튜브"
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

  const handleServicesDropdownChange = (isOpen: boolean) => {
    setActiveDropdown(isOpen ? "services" : null);
  };

  const handleNavLinkClick = (item: NavItem) => {
    if (item.isComingSoon) {
      toast("준비중입니다", {
        description: "해당 기능은 곧 제공될 예정입니다.",
        position: "top-center"
      });
      navigate("/");
      return false;
    }
    
    return true;
  };

  const renderPremiumLink = () => (
    <NavLink
      name="프리미엄"
      path="https://alphademy.co.kr/"
      isScrolled={isScrolled}
      isActive={false}
      isExternal={true}
      className="premium-link"
    />
  );

  useEffect(() => {
    setActiveDropdown(null);
  }, [location.pathname]);
  
  return (
    <nav 
      className="hidden md:flex items-center gap-8" 
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
      
      {renderPremiumLink()}
      
      <GPTSDropdown 
        isScrolled={isScrolled}
        isActive={location.pathname === "/gpts"}
        categories={gptsCategories}
        isOpen={activeDropdown === "gpts"}
        onOpenChange={handleGPTSDropdownChange}
      />

      <NavLink
        name="자료실"
        path="/resources"
        isScrolled={isScrolled}
        isActive={location.pathname.startsWith("/resources")}
      />

      <ServicesDropdown
        isScrolled={isScrolled}
        isActive={isServicePage}
        categories={servicesCategories}
        isOpen={activeDropdown === "services"}
        onOpenChange={handleServicesDropdownChange}
      />

      <CommunityDropdown
        isScrolled={isScrolled}
        isActive={location.pathname === "/open-chat-rooms" || location.pathname === "/business-inquiry"}
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
          onClick={() => handleNavLinkClick(item)}
        />
      ))}
    </nav>
  );
}
