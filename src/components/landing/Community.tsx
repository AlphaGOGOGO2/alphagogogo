
import {
  Users,
  MessageSquare,
  Calendar,
  BookOpen,
  UserPlus
} from "lucide-react";
import { Link } from "react-router-dom";

export function Community() {
  const communityFeatures = [
    {
      icon: <MessageSquare className="text-purple-600" size={20} />,
      title: "포럼 토론",
      description: "AI 관련 주제에 대한 토론과 질문을 나눌 수 있는 열린 공간입니다.",
      color: "bg-soft-blue"
    },
    {
      icon: <Calendar className="text-purple-600" size={20} />,
      title: "오프라인 이벤트",
      description: "정기적인 모임과 컨퍼런스를 통해 직접 만나고 교류할 수 있습니다.",
      color: "bg-soft-green"
    },
    {
      icon: <Users className="text-purple-600" size={20} />,
      title: "스터디 그룹",
      description: "같은 관심사를 가진 사람들과 함께 공부하고 성장할 수 있습니다.",
      color: "bg-soft-yellow"
    },
    {
      icon: <BookOpen className="text-purple-600" size={20} />,
      title: "학습 리소스",
      description: "커뮤니티 회원들이 공유하는 유용한 자료와 튜토리얼을 이용하세요.",
      color: "bg-soft-peach"
    },
    {
      icon: <UserPlus className="text-purple-600" size={20} />,
      title: "멘토링",
      description: "경험이 풍부한 멘토들과 연결되어 개인적인 성장 기회를 얻으세요.",
      color: "bg-soft-purple"
    }
  ];

  return (
    <section id="community" className="py-24 px-6 md:px-8 bg-white relative">
      {/* Section separator - top wavy line */}
      <div className="absolute top-0 left-0 right-0 h-12 overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-16 text-gray-50 fill-current">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-white bg-purple-600 rounded-full shadow-md">
            함께 성장하기
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-gray-800">
            커뮤니티
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-balance">
            AI에 관심 있는 사람들이 모여 지식을 나누고 함께 성장하는 활기찬 커뮤니티에 참여하세요.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {communityFeatures.map((feature, index) => (
            <div 
              key={index}
              className={`p-6 rounded-xl border border-gray-200 transition-all hover:shadow-lg ${feature.color}`}
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="bg-purple-50 p-8 md:p-12 rounded-2xl shadow-lg border border-purple-100">
          <div className="md:flex items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                지금 커뮤니티에 가입하세요
              </h3>
              <p className="text-gray-600 mb-0">
                매주 열리는 토론, 워크샵, 네트워킹 이벤트에 참여하고 전문가들의 멘토링도 받아보세요.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/community/join" 
                className="px-6 py-3 rounded-lg bg-purple-600 text-white font-medium hover:shadow-lg hover:shadow-purple-600/30 transition-all transform hover:-translate-y-0.5"
              >
                가입하기
              </Link>
              <Link 
                to="/community" 
                className="px-6 py-3 rounded-lg bg-white text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 transition-all"
              >
                더 알아보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
