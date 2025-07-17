
import { RocketIcon, Sparkles, ArrowRight, BookText, FileCode, Image, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export function GPTSUsage() {
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
      { threshold: 0.1 } // Trigger when at least 10% of the element is visible
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

  return (
    <section 
      id="gpts-usage" 
      ref={sectionRef}
      className="py-20 px-6 md:px-8 bg-gray-50 relative"
    >
      <div className={`max-w-7xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="mb-12 text-center">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-white bg-purple-600 rounded-full shadow-md">
            무료 체험
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-gray-800">
            GPTS 도구 소개
          </h2>
          <p className="text-purple-700 max-w-2xl mx-auto text-balance">
            알파블로그에서 제공하는 다양한 GPTS 도구들을 이용해보세요. 블로그 작성부터 SEO 최적화까지 AI의 도움을 받아보세요.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: <FileCode className="text-purple-600" size={20} />,
              bgColor: "bg-soft-purple",
              title: "블로그 GPTS",
              description: "블로그 작성과 SEO 최적화를 위한 다양한 AI 도구들을 제공합니다. 각 단계별로 필요한 도구를 선택하여 사용해보세요."
            },
            {
              icon: <Image className="text-blue-600" size={20} />,
              bgColor: "bg-soft-blue",
              title: "그 외 GPTS",
              description: "유튜브 채널 운영과 이미지 생성을 위한 다양한 AI 도구들을 사용해보세요. 각각의 용도에 맞는 GPTS를 선택하여 창의적인 콘텐츠를 만들어보세요."
            },
            {
              icon: <Download className="text-amber-600" size={20} />,
              bgColor: "bg-soft-yellow",
              title: "지침 및 템플릿",
              description: "알파블로그에서 제공하는 지침과 템플릿을 다운로드하여 사용해보세요. 효과적인 콘텐츠 제작에 도움이 됩니다."
            }
          ].map((card, index) => (
            <div 
              key={index}
              className={`bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all hover:border-purple-200 hover:-translate-y-1 duration-300 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              <div className={`w-12 h-12 ${card.bgColor} rounded-full flex items-center justify-center mb-6`}>
                {card.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {card.title}
              </h3>
              <p className="text-gray-600">
                {card.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className={`bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-purple-100 mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-full md:w-2/3">
              <h4 className="text-2xl font-bold mb-4 text-gray-800">GPTS로 작업 효율성을 높이세요</h4>
              <p className="text-gray-600 mb-6">
                알파블로그의 GPTS 도구는 콘텐츠 제작, SEO 최적화, 이미지 생성 등 다양한 작업을 자동화하여 작업 효율성을 크게 향상시킵니다. 
                시간을 절약하고 더 창의적인 작업에 집중할 수 있습니다.
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: <Sparkles className="text-purple-600" size={16} />, text: "콘텐츠 자동 생성" },
                  { icon: <RocketIcon className="text-purple-600" size={16} />, text: "SEO 최적화" },
                  { icon: <BookText className="text-purple-600" size={16} />, text: "템플릿 제공" }
                ].map((feature, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center gap-2 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'}`}
                    style={{ transitionDelay: `${(index + 1) * 100 + 500}ms` }}
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <span className="text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/3 flex justify-center">
              <div className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} style={{ transitionDelay: '800ms' }}>
                <div className="absolute -inset-4 bg-purple-100 rounded-full opacity-50 animate-pulse-slow"></div>
                <div className="relative bg-gradient-to-br from-purple-500 to-purple-700 w-32 h-32 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-5xl font-bold">AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '900ms' }}>
          <Link to="/gpts" className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium hover:shadow-lg hover:shadow-purple-600/30 transition-all transform hover:-translate-y-0.5 text-lg">
            GPTS 이용해보기
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
