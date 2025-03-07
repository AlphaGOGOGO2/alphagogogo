
import { 
  Briefcase, 
  Building2, 
  GraduationCap, 
  LineChart, 
  Lightbulb, 
  Bot, 
  FileSearch, 
  Users 
} from "lucide-react";
import { Link } from "react-router-dom";

export function Services() {
  const services = [
    {
      icon: <Bot className="text-purple-600" size={20} />,
      title: "AI 상담",
      description: "인공지능 기반의 전문 상담 서비스로 즉각적인 답변과 안내를 제공합니다.",
      color: "bg-soft-purple"
    },
    {
      icon: <Building2 className="text-purple-600" size={20} />,
      title: "기업 솔루션",
      description: "비즈니스 요구에 맞춘 AI 기반 커스텀 솔루션으로 업무 효율을 높입니다.",
      color: "bg-soft-blue"
    },
    {
      icon: <GraduationCap className="text-purple-600" size={20} />,
      title: "교육 프로그램",
      description: "인공지능에 대한 이해를 높이는 다양한 교육 커리큘럼을 제공합니다.",
      color: "bg-soft-yellow"
    },
    {
      icon: <LineChart className="text-purple-600" size={20} />,
      title: "리서치 분석",
      description: "데이터 기반의 심층 분석 서비스로 인사이트를 발굴합니다.",
      color: "bg-soft-green"
    },
    {
      icon: <Lightbulb className="text-purple-600" size={20} />,
      title: "혁신 컨설팅",
      description: "최신 AI 기술을 활용한 비즈니스 혁신 전략을 제시합니다.",
      color: "bg-soft-peach"
    },
    {
      icon: <FileSearch className="text-purple-600" size={20} />,
      title: "AI 리서치",
      description: "특정 주제에 대한 심층적인 AI 기반 연구 서비스를 제공합니다.",
      color: "bg-soft-pink"
    },
    {
      icon: <Users className="text-purple-600" size={20} />,
      title: "커뮤니티",
      description: "AI 전문가들과 지식을 나누고 네트워킹할 수 있는 커뮤니티를 제공합니다.",
      color: "bg-soft-orange"
    },
    {
      icon: <Briefcase className="text-purple-600" size={20} />,
      title: "전문가 컨설팅",
      description: "AI 전문가들의 직접적인 컨설팅으로 전문적인 해결책을 제시합니다.",
      color: "bg-soft-gray"
    }
  ];

  return (
    <section id="services" className="py-24 px-6 md:px-8 bg-gray-50 relative">
      {/* Section separator - top wavy line */}
      <div className="absolute top-0 left-0 right-0 h-12 overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-16 text-white fill-current">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-white bg-purple-600 rounded-full shadow-md">
            알파블로그 서비스
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-gray-800">
            제공하는 서비스
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-balance">
            알파블로그는 다양한 AI 기반 서비스를 통해 개인과 기업에게 최적화된 솔루션을 제공합니다.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`p-6 rounded-xl border border-gray-200 transition-all hover:shadow-lg ${service.color}`}
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                {service.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            to="/services" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all"
          >
            서비스 자세히 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
