
import { RocketIcon, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function GPTSUsage() {
  return (
    <section id="gpts-usage" className="py-20 px-6 md:px-8 bg-white relative">
      {/* Section separator - top wavy line */}
      <div className="absolute top-0 left-0 right-0 h-12 overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-16 text-[#f8f9fa] fill-current">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-white bg-purple-600 rounded-full shadow-md">
            무료 체험
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-gray-800">
            GPTS 이용하기
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-balance">
            알파블로그의 인공지능 서비스를 무료로 체험해보세요. 놀라운 AI 기술의 세계로 초대합니다.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="text-purple-600" size={20} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              맞춤형 응답
            </h3>
            <p className="text-gray-600">
              질문이나 요청에 따라 개인화된 응답을 제공하는 강력한 AI 기술을 경험해보세요.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <RocketIcon className="text-purple-600" size={20} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              빠른 정보 접근
            </h3>
            <p className="text-gray-600">
              방대한 데이터베이스에서 필요한 정보를 즉시 찾아주는 AI 검색 기능을 활용하세요.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <ArrowRight className="text-purple-600" size={20} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              쉬운 사용법
            </h3>
            <p className="text-gray-600">
              복잡한 설정 없이 간단한 질문만으로 원하는 결과를 얻을 수 있는 직관적인 인터페이스를 제공합니다.
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <Link to="/gpts" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-purple-600 text-white font-medium hover:shadow-lg hover:shadow-purple-600/30 transition-all transform hover:-translate-y-0.5">
            GPTS 이용해보기
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
