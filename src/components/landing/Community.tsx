
import { Users, MessageSquare, BellDot, Share2, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";

export function Community() {
  const communityFeatures = [
    {
      icon: <MessageSquare className="text-purple-600" size={20} />,
      title: "실시간 채팅",
      description: "AI 관련 주제에 대한 토론과 질문을 나눌 수 있는 열린 실시간 채팅 공간입니다.",
      color: "bg-white border-2 border-purple-100"
    },
    {
      icon: <Users className="text-purple-600" size={20} />,
      title: "활발한 커뮤니티",
      description: "수많은 사용자들이 활발하게 참여하는 AI 중심 커뮤니티에서 다양한 의견을 나눠보세요.",
      color: "bg-white border-2 border-purple-100"
    },
    {
      icon: <BellDot className="text-purple-600" size={20} />,
      title: "실시간 알림",
      description: "중요한 토론이나 답변이 있을 때 실시간으로 알림을 받을 수 있습니다.",
      color: "bg-white border-2 border-purple-100"
    },
    {
      icon: <Share2 className="text-purple-600" size={20} />,
      title: "지식 공유",
      description: "AI에 관한 최신 정보와 자료를 다른 사용자들과 자유롭게 공유할 수 있습니다.",
      color: "bg-white border-2 border-purple-100"
    },
    {
      icon: <HeartHandshake className="text-purple-600" size={20} />,
      title: "네트워킹",
      description: "같은 관심사를 가진 사람들과 연결되어 인적 네트워크를 확장할 수 있습니다.",
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
            AI에 관심 있는 사람들이 모여 실시간으로 대화하고 정보를 공유하는 활기찬 커뮤니티에 참여하세요.
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
                지금 커뮤니티에 참여하세요
              </h3>
              <p className="text-gray-600 mb-6">
                실시간 채팅으로 다른 AI 애호가들과 의견을 나누고, 최신 정보와 아이디어를 공유하세요.
                지금 바로 대화에 참여하고 함께 성장하는 경험을 시작해보세요.
              </p>
              <div className="flex items-center text-sm text-purple-700 mb-0">
                <Users className="h-4 w-4 mr-2" />
                <span>현재 수십 명의 사용자들이 활발하게 대화 중입니다</span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Link 
                to="/community" 
                className="px-6 py-3 rounded-lg bg-purple-600 text-white font-medium hover:shadow-lg hover:shadow-purple-600/30 transition-all transform hover:-translate-y-0.5 text-center"
              >
                실시간 채팅 참여하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
