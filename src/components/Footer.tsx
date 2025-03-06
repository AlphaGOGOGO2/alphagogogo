
import { Link } from "react-router-dom";
import { Twitter, Linkedin, Github, Instagram } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
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
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-[#6a1b9a] transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-[#6a1b9a] transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-[#6a1b9a] transition-colors" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-[#6a1b9a] transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">내비게이션</h3>
            <ul className="space-y-3">
              {[
                { name: "홈", path: "/" },
                { name: "뉴스", path: "/news" },
                { name: "주제", path: "/topics" },
                { name: "소개", path: "/about" }
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
            <h3 className="font-medium text-gray-900 mb-4">카테고리</h3>
            <ul className="space-y-3">
              {[
                { name: "기술", path: "technology" },
                { name: "윤리", path: "ethics" },
                { name: "연구", path: "research" },
                { name: "의료", path: "healthcare" },
                { name: "비즈니스", path: "business" },
                { name: "교육", path: "education" }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={`/topics/${item.path}`}
                    className="text-gray-600 hover:text-[#6a1b9a] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">법적 정보</h3>
            <ul className="space-y-3">
              {[
                { name: "개인정보 처리방침", path: "privacy-policy" },
                { name: "서비스 이용약관", path: "terms-of-service" },
                { name: "쿠키 정책", path: "cookie-policy" },
                { name: "GDPR 준수", path: "gdpr-compliance" }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={`/legal/${item.path}`}
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
