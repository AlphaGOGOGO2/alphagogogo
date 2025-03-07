
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
      color: "bg-white border-2 border-purple-100"
    },
    {
      icon: <Calendar className="text-purple-600" size={20} />,
      title: "오프라인 이벤트",
      description: "정기적인 모임과 컨퍼런스를 통해 직접 만나고 교류할 수 있습니다.",
      color: "bg-white border-2 border-purple-100"
    },
    {
      icon: <Users className="text-purple-600" size={20} />,
      title: "스터디 그룹",
      description: "같은 관심사를 가진 사람들과 함께 공부하고 성장할 수 있습니다.",
      color: "bg-white border-2 border-purple-100"
    },
    {
      icon: <BookOpen className="text-purple-600" size={20} />,
      title: "학습 리소스",
      description: "커뮤니티 회원들이 공유하는 유용한 자료와 튜토리얼을 이용하세요.",
      color: "bg-white border-2 border-purple-100"
    },
    {
      icon: <UserPlus className="text-purple-600" size={20} />,
      title: "멘토링",
      description: "경험이 풍부한 멘토들과 연결되어 개인적인 성장 기회를 얻으세요.",
      color: "bg-white border-2 border-purple-100"
    }
  ];

  return (
    <section id="community" className="py-24 px-6 md:px-8 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-white bg-purple-600 rounded-full shadow-md">
            함께 성장하기
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-gray-800">
            커뮤니티
          </h2>
          <p className="text-purple-700 max-w-2xl mx-auto text-balance">
            AI에 관심 있는 사람들이 모여 지식을 나누고 함께 성장하는 활기찬 커뮤니티에 참여하세요.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {communityFeatures.map((feature, index) => (
            <div 
              key={index}
              className={`p-6 rounded-xl transition-all hover:shadow-lg ${feature.color} hover:border-purple-300`}
            >
              <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mb-4 shadow-sm">
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
        
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-md border border-purple-100">
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
