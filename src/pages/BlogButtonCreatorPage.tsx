
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { BlogButtonCreator } from "@/components/services/blog-button-creator/BlogButtonCreator";

export default function BlogButtonCreatorPage() {
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
          
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">블로그 버튼 생성기</h1>
            <p className="text-lg text-gray-600 max-w-full">
              블로그에 사용할 커스텀 HTML 버튼을 쉽게 디자인하고 생성해보세요. 
              원하는 디자인으로 만들고 HTML 코드를 복사해 블로그에 바로 붙여넣기 할 수 있습니다.
            </p>
          </div>
          
          <BlogButtonCreator />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
