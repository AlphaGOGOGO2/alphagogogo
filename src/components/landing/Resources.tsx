import { Download, FileText, BookOpen, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export function Resources() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  const resourceCategories = [
    {
      icon: <FileText className="text-purple-600" size={20} />,
      title: "AI 도구 가이드",
      description: "최신 AI 도구들의 활용법과 실무 적용 방법을 담은 상세한 가이드북을 제공합니다.",
      count: "15+ 가이드"
    },
    {
      icon: <BookOpen className="text-blue-600" size={20} />,
      title: "블로그 자동화 템플릿",
      description: "블로그 작성부터 SEO 최적화까지 자동화할 수 있는 실용적인 템플릿 모음집입니다.",
      count: "20+ 템플릿"
    },
    {
      icon: <Star className="text-amber-600" size={20} />,
      title: "SEO 최적화 체크리스트",
      description: "검색엔진 최적화를 위한 단계별 체크리스트와 실전 노하우를 다운로드하세요.",
      count: "10+ 체크리스트"
    }
  ];

  return (
    <section 
      id="resources" 
      ref={sectionRef}
      className="py-20 px-6 md:px-8 bg-white relative"
    >
      <div className="max-w-7xl mx-auto">
        <div className={`mb-12 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-white bg-purple-600 rounded-full shadow-md">
            무료 다운로드
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-gray-800">
            자료실 & 리소스
          </h2>
          <p className="text-purple-700 max-w-2xl mx-auto text-balance">
            AI 시대에 필요한 실무 가이드, 템플릿, 체크리스트를 무료로 다운로드하여 바로 활용해보세요.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {resourceCategories.map((category, index) => (
            <div 
              key={index}
              className={`bg-white border-2 border-purple-100 p-8 rounded-xl transition-all duration-500 hover:shadow-lg hover:border-purple-300 hover:-translate-y-1 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                {category.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {category.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {category.description}
              </p>
              <div className="text-sm text-purple-600 font-medium mb-4">
                {category.count}
              </div>
            </div>
          ))}
        </div>
        
        <div className={`bg-gradient-to-r from-purple-50 to-blue-50 p-8 md:p-12 rounded-2xl shadow-lg border border-purple-100 mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
          <div className="text-center">
            <h4 className="text-2xl font-bold mb-4 text-gray-800">
              지금 바로 무료 리소스를 받아보세요
            </h4>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              알파블로그에서 엄선한 AI 도구 가이드, 블로그 자동화 템플릿, SEO 최적화 체크리스트를 
              무료로 다운로드하여 여러분의 업무 효율성을 극대화하세요.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                { icon: <Download size={16} />, text: "즉시 다운로드" },
                { icon: <FileText size={16} />, text: "PDF 포맷" },
                { icon: <Star size={16} />, text: "실무 검증됨" }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'}`}
                  style={{ transitionDelay: `${(index + 1) * 100 + 500}ms` }}
                >
                  <div className="text-purple-600">
                    {feature.icon}
                  </div>
                  <span className="text-gray-700 text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
            <Link 
              to="/resources" 
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all hover:shadow-lg hover:shadow-purple-600/30 transform hover:-translate-y-0.5"
            >
              자료실 둘러보기
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}