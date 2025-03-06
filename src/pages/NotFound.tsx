
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 오류: 사용자가 존재하지 않는 경로에 접근을 시도했습니다:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-[#f3e5f5]">
      <div className="text-center p-8 rounded-2xl glass-card purple-glow max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-red-50 text-red-500">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-6xl font-bold mb-4 text-[#6a1b9a]">404</h1>
        <p className="text-xl text-gray-600 mb-8">이런! 페이지를 찾을 수 없습니다</p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#6a1b9a] to-[#8e24aa] text-white font-medium hover:shadow-lg hover:shadow-[#6a1b9a]/30 transition-all transform hover:-translate-y-0.5"
        >
          <Home size={18} />
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
