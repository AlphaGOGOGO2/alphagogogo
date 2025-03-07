
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { YouTubeTranscriptService } from "@/components/services/YouTubeTranscriptService";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              <span>홈으로 돌아가기</span>
            </Link>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">서비스</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-full">
            알파블로그에서 제공하는 다양한 실용적인 서비스를 이용해보세요.
          </p>
          
          <YouTubeTranscriptService />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
