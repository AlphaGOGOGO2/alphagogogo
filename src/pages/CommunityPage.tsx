
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CommunityChat } from "@/components/community/CommunityChat";

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
          <div className={`text-center mb-12 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">커뮤니티 채팅</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI에 관심 있는 사람들과 실시간으로 대화하고 정보를 공유하세요.
            </p>
          </div>
          
          <div className={`transition-all duration-500 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <CommunityChat />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
