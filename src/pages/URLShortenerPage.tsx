
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { URLShortenerService } from "@/components/services/URLShortenerService";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Banner } from "@/components/Banner";

export default function URLShortenerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link 
              to="/services" 
              className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              <span>서비스 목록으로 돌아가기</span>
            </Link>
          </div>
          
          <Banner className="mb-10" />
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">URL 단축</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-full">
            긴 URL을 짧고 간결한 링크로 변환하여 공유하기 쉽게 만듭니다.
          </p>
          
          <URLShortenerService />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
