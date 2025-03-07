
import { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, MessageCircle, ExternalLink, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";
import { type CommunityCategory } from "@/config/navigation";
import { useToast } from "@/hooks/use-toast";

interface CommunityDropdownProps {
  isScrolled: boolean;
  isActive: boolean;
  categories: CommunityCategory[];
  onOpenChange: (isOpen: boolean) => void;
  isOpen: boolean;
}

export function CommunityDropdown({ 
  isScrolled, 
  isActive, 
  categories,
  isOpen,
  onOpenChange
}: CommunityDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onOpenChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false);
    }
    if (e.key === 'Enter' || e.key === ' ') {
      onOpenChange(!isOpen);
    }
  };

  let closeTimer: ReturnType<typeof setTimeout>;
  
  const handleMouseLeave = () => {
    closeTimer = setTimeout(() => onOpenChange(false), 300);
  };
  
  const handleMouseEnter = () => {
    if (closeTimer) {
      clearTimeout(closeTimer);
    }
  };

  const handleCategoryClick = (category: CommunityCategory, event: React.MouseEvent) => {
    onOpenChange(false);
    
    // 일반 링크 클릭은 기본 동작 그대로 유지
    if (!category.action) {
      navigate(category.path);
      return;
    }
    
    // 팝업 액션이 있는 경우 기본 동작 중단
    event.preventDefault();
    
    if (category.action === 'popup' && category.actionData) {
      // 팝업창 열기
      const width = 400;
      const height = 200;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;
      
      const popup = window.open(
        "",
        "popup",
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
      );
      
      if (popup) {
        popup.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>안내</title>
            <meta charset="UTF-8">
            <style>
              body {
                font-family: 'Noto Sans KR', sans-serif;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: #f8f9fa;
              }
              .container {
                background-color: white;
                padding: 2rem;
                border-radius: 0.5rem;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
                max-width: 80%;
              }
              h2 {
                color: #6200ee;
                margin-bottom: 1rem;
              }
              p {
                color: #333;
                font-size: 1.1rem;
                margin-bottom: 1.5rem;
              }
              button {
                background-color: #6200ee;
                color: white;
                border: none;
                padding: 0.5rem 1.5rem;
                border-radius: 0.25rem;
                cursor: pointer;
                font-size: 1rem;
                transition: background-color 0.2s;
              }
              button:hover {
                background-color: #5000d6;
              }
              .info-icon {
                font-size: 2.5rem;
                color: #6200ee;
                margin-bottom: 1rem;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="info-icon">ℹ️</div>
              <h2>${category.name === "오픈 채팅방" ? "오픈 채팅방 입장 안내" : "비즈니스 문의 안내"}</h2>
              <p>${category.actionData}</p>
              <button onclick="closeAndRedirect()">확인</button>
            </div>
            <script>
              function closeAndRedirect() {
                ${category.name === "오픈 채팅방" ? `window.opener.location.href = "${category.path}";` : ''}
                window.close();
              }
            </script>
          </body>
          </html>
        `);
      }
    }
  };
  
  // 각 카테고리에 맞는 아이콘 가져오기
  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case "실시간 채팅":
        return <MessageCircle size={16} />;
      case "오픈 채팅방":
        return <ExternalLink size={16} />;
      case "비즈니스 문의":
        return <Mail size={16} />;
      default:
        return null;
    }
  };
  
  return (
    <div 
      className="relative inline-block"
      ref={dropdownRef}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => {
        handleMouseEnter();
        onOpenChange(true);
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => onOpenChange(!isOpen)}
        onMouseEnter={() => onOpenChange(true)}
        className="inline-flex items-center"
      >
        <NavLink 
          name="커뮤니티"
          path="/community"
          isScrolled={isScrolled}
          isActive={isActive}
          iconRight={
            <ChevronDown 
              size={16} 
              className={cn(
                "transition-transform duration-300", 
                isOpen ? "rotate-180" : "rotate-0",
                isScrolled ? "text-purple-700" : "text-white/80"
              )}
              aria-hidden="true"
            /> 
          }
        />
      </div>
      
      <div 
        className={cn(
          "absolute z-50 left-0 mt-1 min-w-48 w-max rounded-md shadow-lg overflow-hidden transition-all duration-200 origin-top-left",
          isOpen 
            ? "transform scale-100 opacity-100" 
            : "transform scale-95 opacity-0 pointer-events-none",
          isScrolled 
            ? "bg-white border border-gray-200" 
            : "bg-black/80 backdrop-blur-lg border border-white/20"
        )}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="community-menu"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
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
                onClick={(e) => handleCategoryClick(category, e)}
                role="menuitem"
              >
                {getCategoryIcon(category.name)}
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
                onClick={(e) => handleCategoryClick(category, e)}
                role="menuitem"
              >
                {getCategoryIcon(category.name)}
                {category.name}
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

