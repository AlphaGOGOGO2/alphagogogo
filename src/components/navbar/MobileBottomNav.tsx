
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, MessageCircle, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const location = useLocation();
  
  const navItems = [
    { name: "홈", path: "/", icon: <Home size={22} /> },
    { name: "블로그", path: "/blog", icon: <BookOpen size={22} /> },
    { name: "실시간 채팅", path: "/community", icon: <MessageCircle size={22} /> },
    { name: "더보기", path: "#", icon: <Menu size={22} /> }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg safe-area-pb">
      <div className="flex justify-around items-center h-16 sm:h-18">
        {navItems.map((item) => {
          if (item.name === "더보기") {
            return (
              <button
                key={item.name}
                className="flex flex-col items-center justify-center w-full h-full min-h-[44px] touch-manipulation active:bg-purple-50 transition-colors"
                aria-label="더 많은 메뉴 보기"
                onClick={() => document.getElementById('mobile-menu-trigger')?.click()}
              >
                <span className="text-purple-600">{item.icon}</span>
                <span className="text-xs mt-1 text-purple-600 font-medium">{item.name}</span>
              </button>
            );
          }
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full min-h-[44px] touch-manipulation active:bg-purple-50 transition-colors",
                (location.pathname === item.path ||
                 (item.path === "/blog" && location.pathname.startsWith("/blog")) ||
                 (item.path === "/community" && location.pathname === "/community"))
                  ? "text-purple-700"
                  : "text-gray-600"
              )}
              aria-current={(location.pathname === item.path ||
                            (item.path === "/blog" && location.pathname.startsWith("/blog")) ||
                            (item.path === "/community" && location.pathname === "/community"))
                              ? "page"
                              : undefined}
            >
              <span>{item.icon}</span>
              <span className="text-xs mt-1 font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
