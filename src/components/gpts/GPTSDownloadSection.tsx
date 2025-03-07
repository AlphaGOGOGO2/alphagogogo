
import { Download } from "lucide-react";

export function GPTSDownloadSection() {
  return (
    <section className="mb-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-purple-900 mb-4">지침 및 템플릿 다운로드</h2>
        <p className="text-gray-600">
          알파블로그에서 제공하는 지침과 템플릿을 다운로드하여 사용해보세요. 효과적인 콘텐츠 제작에 도움이 됩니다.
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-8 shadow-sm border border-purple-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-purple-800 mb-3">콘텐츠 제작 가이드라인 및 템플릿</h3>
            <p className="text-gray-600 mb-4">
              블로그 작성, 유튜브 콘텐츠 제작, 이미지 생성을 위한 다양한 템플릿과 가이드라인을 제공합니다. 
              다운로드하여 콘텐츠 제작 프로세스를 더욱 효율적으로 진행해보세요.
            </p>
          </div>
          
          <a 
            href="https://drive.google.com/drive/folders/15Dg6EwwqZbrLM5UIiXAX-9MWViPZUOUi?usp=drive_link" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition-colors min-w-[200px]"
          >
            <Download size={18} />
            다운로드
          </a>
        </div>
      </div>
    </section>
  );
}
