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
    <section id="services" className="py-24 px-6 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-white bg-purple-600 rounded-full shadow-md">
            알파블로그 서비스
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-purple-800">
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
              className={`p-6 rounded-xl border border-purple-100 transition-all hover:shadow-lg ${service.color}`}
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                {service.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 text-purple-800">
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-100 text-purple-800 font-medium hover:bg-purple-200 transition-all"
          >
            서비스 자세히 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
