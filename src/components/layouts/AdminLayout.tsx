
import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  FileText, 
  Settings, 
  Tags, 
  Newspaper,
  Home,
  AdIcon,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPasswordModal } from "@/components/blog/BlogPasswordModal";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // 관리자 세션 확인
  const isAuthorized = sessionStorage.getItem("blogAuthToken") === "authorized";
  
  // 인증 확인
  if (!isAuthorized) {
    // 인증되지 않은 경우 인증 모달 표시
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">관리자 인증 필요</h1>
          <p className="mb-6 text-gray-600">이 페이지에 접근하려면 관리자 인증이 필요합니다.</p>
          <Button onClick={() => setShowAuthModal(true)}>
            인증하기
          </Button>
          <BlogPasswordModal 
            isOpen={showAuthModal} 
            onClose={() => setShowAuthModal(false)} 
          />
        </div>
      </div>
    );
  }
  
  // 사이드바 네비게이션 항목
  const navItems: NavItem[] = [
    { name: "대시보드", path: "/admin", icon: BarChart3 },
    { name: "블로그 관리", path: "/admin/posts", icon: FileText },
    { name: "카테고리 관리", path: "/admin/categories", icon: Tags },
    { name: "광고 관리", path: "/admin/ads", icon: AdIcon },
    { name: "시스템 설정", path: "/admin/settings", icon: Settings },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 사이드바 */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-purple-600">알파GOGOGO 관리자</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50",
                    location.pathname === item.path && "bg-purple-100 text-purple-700 font-medium"
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <User className="h-6 w-6 text-gray-500" />
            <div>
              <p className="font-medium">알파GOGOGO</p>
              <p className="text-xs text-gray-500">관리자</p>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <Link to="/" className="flex items-center text-sm text-gray-600 hover:text-purple-600">
              <Home className="h-4 w-4 mr-1" />
              사이트로 돌아가기
            </Link>
          </div>
        </div>
      </div>
      
      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      
      {/* 인증 모달 */}
      <BlogPasswordModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}
