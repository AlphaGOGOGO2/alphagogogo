
import { 
  Youtube, 
  Link2, 
  MousePointerClick, 
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import { servicesCategories } from "@/config/navigation";
import { useEffect, useState, useRef } from "react";

export function Services() {
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
      id="services" 
      ref={sectionRef}
      className="py-24 px-6 md:px-8 bg-white relative"
    >
      {/* Section separator - top wavy line */}
      <div className="absolute top-0 left-0 right-0 h-12 overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-16 text-white fill-current">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className={`mb-16 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-white bg-purple-600 rounded-full shadow-md">
            알파블로그 서비스
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-gray-800">
            제공하는 서비스
          </h2>
          <p className="text-purple-700 max-w-2xl mx-auto text-balance">
            알파블로그는 실용적인 AI 기반 서비스를 통해 여러분의 작업을 더 쉽고 효율적으로 만듭니다.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "유튜브 자막 추출기",
              description: "YouTube 동영상의 자막을 텍스트로 변환하여 쉽게 복사하고 활용할 수 있습니다. 영어 교육 콘텐츠, TED 강연, 자막이 있는 공식 채널 영상에서 가장 잘 작동합니다.",
              icon: <Youtube className="text-purple-600" size={24} />,
              path: "/youtube-transcript"
            },
            {
              title: "URL 단축기",
              description: "복잡한 URL을 간결하게 줄여 SNS, 메시지, 이메일 등에서 더 깔끔하게 공유할 수 있습니다. 단축된 URL은 영구적으로 사용할 수 있습니다.",
              icon: <Link2 className="text-purple-600" size={24} />,
              path: "/url-shortener"
            },
            {
              title: "블로그 버튼 생성기",
              description: "색상, 폰트, 크기 등을 원하는 대로 커스터마이징하여 블로그에 사용할 수 있는 매력적인 버튼 HTML 코드를 생성합니다.",
              icon: <MousePointerClick className="text-purple-600" size={24} />,
              path: "/blog-button-creator"
            }
          ].map((service, index) => (
            <div 
              key={index}
              className={`bg-white border-2 border-purple-100 p-8 rounded-xl transition-all hover:shadow-lg hover:border-purple-300 flex flex-col ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6 flex-grow">
                {service.description}
              </p>
              <div className="mt-auto">
                <Link 
                  to={service.path}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all"
                >
                  <ExternalLink size={16} />
                  서비스 이용하기
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '500ms' }}>
          <Link 
            to="/services" 
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all hover:shadow-lg hover:shadow-purple-600/30"
          >
            모든 서비스 살펴보기
            <ExternalLink size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
