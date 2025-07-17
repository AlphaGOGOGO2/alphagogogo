import { GraduationCap, BookText, Users, TrendingUp, ArrowRight, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export function AIGuide() {
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

  const guideCategories = [
    {
      icon: <GraduationCap className="text-purple-600" size={20} />,
      title: "AI 기초 입문",
      description: "AI를 처음 접하는 분들을 위한 친절한 기초 가이드입니다. 복잡한 용어 없이 쉽게 설명합니다.",
      level: "초급"
    },
    {
      icon: <BookText className="text-blue-600" size={20} />,
      title: "실무 활용법",
      description: "일상과 업무에서 AI를 실제로 활용하는 구체적인 방법과 사례를 소개합니다.",
      level: "중급"
    },
    {
      icon: <TrendingUp className="text-green-600" size={20} />,
      title: "고급 최적화",
      description: "AI 도구의 성능을 극대화하고 워크플로우를 최적화하는 고급 테크닉을 배웁니다.",
      level: "고급"
    }
  ];

  return (
    <section 
      id="ai-guide" 
      ref={sectionRef}
      className="py-20 px-6 md:px-8 bg-gray-50 relative"
    >
      <div className="max-w-7xl mx-auto">
        <div className={`mb-12 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-white bg-purple-600 rounded-full shadow-md">
            단계별 학습
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-gray-800">
            AI 학습 가이드
          </h2>
          <p className="text-purple-700 max-w-2xl mx-auto text-balance">
            AI 초보자부터 고급 사용자까지, 단계별로 체계적인 학습 경로를 제공하여 AI 전문가로 성장할 수 있도록 돕습니다.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {guideCategories.map((guide, index) => (
            <div 
              key={index}
              className={`bg-white border-2 border-purple-100 p-8 rounded-xl transition-all duration-500 hover:shadow-lg hover:border-purple-300 hover:-translate-y-1 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center shadow-sm">
                  {guide.icon}
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                  {guide.level}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {guide.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {guide.description}
              </p>
              <div className="flex items-center gap-2 text-purple-600 text-sm font-medium">
                <PlayCircle size={16} />
                <span>학습 시작하기</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className={`bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-purple-100 mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
          <div className="md:flex items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h4 className="text-2xl font-bold mb-4 text-gray-800">
                체계적인 AI 학습을 시작하세요
              </h4>
              <p className="text-gray-600 mb-6">
                전문가가 설계한 커리큘럼으로 AI의 기초부터 고급 활용법까지 단계별로 학습할 수 있습니다. 
                이론과 실습을 병행하여 실무에 바로 적용 가능한 실력을 키워보세요.
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: <Users size={16} />, text: "커뮤니티 지원" },
                  { icon: <BookText size={16} />, text: "실습 중심" },
                  { icon: <TrendingUp size={16} />, text: "단계별 성장" }
                ].map((feature, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center gap-2 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'}`}
                    style={{ transitionDelay: `${(index + 1) * 100 + 500}ms` }}
                  >
                    <div className="text-purple-600">
                      {feature.icon}
                    </div>
                    <span className="text-gray-700 text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Link 
                to="/blog/tutorials" 
                className="px-6 py-3 rounded-lg bg-purple-600 text-white font-medium hover:shadow-lg hover:shadow-purple-600/30 transition-all transform hover:-translate-y-0.5 text-center inline-flex items-center gap-2"
              >
                학습 가이드 보기
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}