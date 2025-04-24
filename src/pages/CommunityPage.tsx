
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CommunityChat } from "@/components/community/CommunityChat";
import { AlertTriangle } from "lucide-react";
import { Banner } from "@/components/Banner";
import { AdSense } from "@/components/AdSense";

export default function CommunityPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`text-center mb-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">커뮤니티 채팅</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI에 관심 있는 사람들과 실시간으로 대화하고 정보를 공유하세요.
            </p>
          </div>
          
          <div className={`bg-purple-50 border border-purple-200 rounded-lg p-4 mb-8 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-purple-500 h-6 w-6 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-purple-800 mb-1">주의사항</h3>
                <p className="text-purple-700 text-sm mb-1">
                  알파GOGOGO는 그 어떤 금전요구나 쿠폰 광고 홍보 등 하지 않습니다!
                </p>
                <p className="text-purple-700 text-sm mb-1">
                  자유로운 형태 실시간 채팅이다보니, 광고성글에 낚이지 마시고!
                </p>
                <p className="text-purple-700 text-sm">
                  사칭범은 아이피 벤 들어갑니다.
                </p>
              </div>
            </div>
          </div>
          
          {/* Add Banner component below the warning section */}
          <div className={`transition-all duration-500 delay-125 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'}`}>
            <Banner className="mb-8" />
          </div>
          
          <div className="mb-8">
            <AdSense adFormat="horizontal" style={{ minHeight: "90px" }} />
          </div>
          
          <div className={`transition-all duration-500 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <CommunityChat />
          </div>

          <div className="mt-12">
            <AdSense adFormat="horizontal" style={{ minHeight: "90px" }} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
