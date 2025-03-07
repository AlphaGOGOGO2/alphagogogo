
import { RocketIcon, Sparkles, ArrowRight, BookText, FileCode, Image, Download } from "lucide-react";
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
            알파블로그에서 제공하는 다양한 GPTS 도구들을 이용해보세요. 블로그 작성부터 SEO 최적화까지 AI의 도움을 받아보세요.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all hover:border-purple-200 hover:-translate-y-1 duration-300">
            <div className="w-12 h-12 bg-soft-purple rounded-full flex items-center justify-center mb-6">
              <FileCode className="text-purple-600" size={20} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              블로그 GPTS
            </h3>
            <p className="text-gray-600">
              블로그 작성과 SEO 최적화를 위한 다양한 AI 도구들을 제공합니다. 각 단계별로 필요한 도구를 선택하여 사용해보세요.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all hover:border-purple-200 hover:-translate-y-1 duration-300">
            <div className="w-12 h-12 bg-soft-blue rounded-full flex items-center justify-center mb-6">
              <Image className="text-blue-600" size={20} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              그 외 GPTS
            </h3>
            <p className="text-gray-600">
              유튜브 채널 운영과 이미지 생성을 위한 다양한 AI 도구들을 사용해보세요. 각각의 용도에 맞는 GPTS를 선택하여 창의적인 콘텐츠를 만들어보세요.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all hover:border-purple-200 hover:-translate-y-1 duration-300">
            <div className="w-12 h-12 bg-soft-yellow rounded-full flex items-center justify-center mb-6">
              <Download className="text-amber-600" size={20} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              지침 및 템플릿
            </h3>
            <p className="text-gray-600">
              알파블로그에서 제공하는 지침과 템플릿을 다운로드하여 사용해보세요. 효과적인 콘텐츠 제작에 도움이 됩니다.
            </p>
          </div>
        </div>
        
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-purple-100 mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-full md:w-2/3">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">GPTS로 작업 효율성을 높이세요</h3>
              <p className="text-gray-600 mb-6">
                알파블로그의 GPTS 도구는 콘텐츠 제작, SEO 최적화, 이미지 생성 등 다양한 작업을 자동화하여 작업 효율성을 크게 향상시킵니다. 
                시간을 절약하고 더 창의적인 작업에 집중할 수 있습니다.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Sparkles className="text-purple-600" size={16} />
                  </div>
                  <span className="text-gray-700">콘텐츠 자동 생성</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <RocketIcon className="text-purple-600" size={16} />
                  </div>
                  <span className="text-gray-700">SEO 최적화</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <BookText className="text-purple-600" size={16} />
                  </div>
                  <span className="text-gray-700">템플릿 제공</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-purple-100 rounded-full opacity-50 animate-pulse-slow"></div>
                <div className="relative bg-gradient-to-br from-purple-500 to-purple-700 w-32 h-32 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-5xl font-bold">AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link to="/gpts" className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium hover:shadow-lg hover:shadow-purple-600/30 transition-all transform hover:-translate-y-0.5 text-lg">
            GPTS 이용해보기
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
