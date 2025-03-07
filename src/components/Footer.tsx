
import { Link } from "react-router-dom";
import { blogCategories, gptsCategories } from "@/config/navigation";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-heading text-xl md:text-2xl font-semibold mb-4">
              <img 
                src="https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png" 
                alt="알파블로그 로고" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-[#6a1b9a]">알파블로그</span>
            </Link>
            <p className="text-gray-600 mb-6 text-balance">
              심층 보도와 분석을 통해 인공지능의 미래를 탐색합니다.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">블로그</h3>
            <ul className="space-y-3">
              {blogCategories.map((category) => (
                <li key={category.name}>
                  <Link 
                    to={category.path}
                    className="text-gray-600 hover:text-[#6a1b9a] transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">GPTS 이용하기</h3>
            <ul className="space-y-3">
              {gptsCategories.map((category) => (
                <li key={category.name}>
                  <Link 
                    to={category.path}
                    className="text-gray-600 hover:text-[#6a1b9a] transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">서비스</h3>
            <ul className="space-y-3">
              {[
                { name: "AI 상담", path: "/services/consultation" },
                { name: "기업 솔루션", path: "/services/enterprise" },
                { name: "교육 프로그램", path: "/services/education" },
                { name: "리서치 분석", path: "/services/research" }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path}
                    className="text-gray-600 hover:text-[#6a1b9a] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">커뮤니티</h3>
            <ul className="space-y-3">
              {[
                { name: "포럼", path: "/community/forum" },
                { name: "이벤트", path: "/community/events" },
                { name: "스터디 그룹", path: "/community/study-groups" },
                { name: "자료실", path: "/community/resources" }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path}
                    className="text-gray-600 hover:text-[#6a1b9a] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm order-2 md:order-1 mt-4 md:mt-0">
            © {currentYear} 알파블로그. 모든 권리 보유.
          </p>
          <div className="flex gap-6 text-sm order-1 md:order-2">
            <Link to="#" className="text-gray-600 hover:text-[#6a1b9a] transition-colors">
              개인정보
            </Link>
            <Link to="#" className="text-gray-600 hover:text-[#6a1b9a] transition-colors">
              이용약관
            </Link>
            <Link to="#" className="text-gray-600 hover:text-[#6a1b9a] transition-colors">
              문의하기
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
