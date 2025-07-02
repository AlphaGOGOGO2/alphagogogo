
import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  FileText, 
  Settings, 
  Tags, 
  Newspaper,
  Home,
  User,
  FolderOpen,
  HandHeart,
  LogOut,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPasswordModal } from "@/components/blog/BlogPasswordModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 로컬 스토리지에서 사이드바 상태 불러오기
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('adminSidebarCollapsed');
    const savedTheme = localStorage.getItem('adminTheme');
    
    if (savedSidebarState) {
      setIsSidebarCollapsed(JSON.parse(savedSidebarState));
    }
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  // 사이드바 토글
  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('adminSidebarCollapsed', JSON.stringify(newState));
  };

  // 다크모드 토글
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('adminTheme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  // 로그아웃
  const handleLogout = () => {
    sessionStorage.removeItem("blogAuthToken");
    window.location.href = "/admin";
  };

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
            onSuccess={() => window.location.reload()} // 인증 성공 시 새로고침(즉시 어드민 진입)
          />
        </div>
      </div>
    );
  }

  // 사이드바 네비게이션 항목
  const navItems: NavItem[] = [
    { name: "대시보드", path: "/admin", icon: BarChart3 },
    { name: "블로그 관리", path: "/admin/posts", icon: FileText },
    { name: "자료실 관리", path: "/admin/resources", icon: FolderOpen },
    { name: "AI 품앗이 관리", path: "/admin/ai-services", icon: HandHeart },
    { name: "카테고리 관리", path: "/admin/categories", icon: Tags },
    { name: "시스템 설정", path: "/admin/settings", icon: Settings },
  ];

  return (
    <TooltipProvider>
      <div className={cn("min-h-screen flex transition-colors", isDarkMode ? "bg-gray-900" : "bg-gray-50")}>
        {/* 사이드바 */}
        <div className={cn(
          "flex flex-col border-r transition-all duration-300",
          isSidebarCollapsed ? "w-16" : "w-64",
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        )}>
          <div className={cn("p-4 border-b flex items-center justify-between", isDarkMode ? "border-gray-700" : "border-gray-200")}>
            {!isSidebarCollapsed && (
              <h1 className={cn("text-xl font-bold text-purple-600 truncate", isDarkMode ? "text-purple-400" : "")}>
                알파GOGOGO 관리자
              </h1>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className={cn("hover:bg-purple-50", isDarkMode ? "hover:bg-gray-700" : "")}
            >
              {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </Button>
          </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const NavContent = (
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-3 rounded-lg transition-all duration-200",
                    isActive 
                      ? isDarkMode 
                        ? "bg-purple-600 text-white shadow-lg" 
                        : "bg-purple-100 text-purple-700 shadow-md"
                      : isDarkMode
                        ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                        : "text-gray-700 hover:bg-purple-50 hover:text-purple-600",
                    isSidebarCollapsed ? "justify-center" : ""
                  )}
                >
                  <item.icon className={cn("h-5 w-5", !isSidebarCollapsed && "mr-3")} />
                  {!isSidebarCollapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </Link>
              );

              return (
                <li key={item.path}>
                  {isSidebarCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {NavContent}
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    NavContent
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className={cn("p-4 border-t space-y-3", isDarkMode ? "border-gray-700" : "border-gray-200")}>
          {!isSidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <User className={cn("h-4 w-4", isDarkMode ? "text-purple-400" : "text-purple-600")} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("font-medium truncate", isDarkMode ? "text-white" : "text-gray-900")}>알파GOGOGO</p>
                <p className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>관리자</p>
              </div>
            </div>
          )}
          
          <div className="flex flex-col space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className={cn(
                    "justify-start",
                    isSidebarCollapsed ? "px-3" : "w-full",
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  )}
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {!isSidebarCollapsed && (
                    <span className="ml-2">{isDarkMode ? "라이트 모드" : "다크 모드"}</span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link 
                  to="/" 
                  className={cn(
                    "flex items-center text-sm rounded-lg px-3 py-2 transition-colors",
                    isSidebarCollapsed ? "justify-center" : "",
                    isDarkMode 
                      ? "text-gray-300 hover:bg-gray-700 hover:text-white" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-purple-600"
                  )}
                >
                  <Home className="h-4 w-4" />
                  {!isSidebarCollapsed && <span className="ml-2">사이트로 돌아가기</span>}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>사이트로 돌아가기</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className={cn(
                    "justify-start text-red-600 hover:text-red-700",
                    isSidebarCollapsed ? "px-3" : "w-full",
                    isDarkMode ? "hover:bg-red-900/20" : "hover:bg-red-50"
                  )}
                >
                  <LogOut className="h-4 w-4" />
                  {!isSidebarCollapsed && <span className="ml-2">로그아웃</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>로그아웃</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
      
        {/* 메인 컨텐츠 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className={cn(
            "shadow-sm z-10 border-b",
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          )}>
            <div className="px-6 py-4 flex items-center justify-between">
              <h1 className={cn("text-2xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>
                {title}
              </h1>
              <div className="flex items-center space-x-4">
                <div className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                  {new Date().toLocaleDateString('ko-KR')}
                </div>
              </div>
            </div>
          </header>
          
          <main className={cn("flex-1 overflow-y-auto p-6", isDarkMode ? "bg-gray-900" : "bg-gray-50")}>
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
