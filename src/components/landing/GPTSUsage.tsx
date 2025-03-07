
import { RocketIcon, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function GPTSUsage() {
  return (
    <section id="gpts-usage" className="py-20 px-6 md:px-8 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-white bg-purple-600 rounded-full shadow-md">
            무료 체험
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-gray-800">
            GPTS 이용하기
          </h2>
          <p className="text-purple-700 max-w-2xl mx-auto text-balance">
            알파블로그의 인공지능 서비스를 무료로 체험해보세요. 놀라운 AI 기술의 세계로 초대합니다.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all hover:border-purple-200">
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
          
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all hover:border-purple-200">
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
          
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all hover:border-purple-200">
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
