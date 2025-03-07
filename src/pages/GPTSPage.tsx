
import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GPTSBlogSection } from "@/components/gpts/GPTSBlogSection";
import { GPTSOtherSection } from "@/components/gpts/GPTSOtherSection";
import { GPTSDownloadSection } from "@/components/gpts/GPTSDownloadSection";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function GPTSPage() {
  const location = useLocation();
  const blogSectionRef = useRef<HTMLDivElement>(null);
  const otherSectionRef = useRef<HTMLDivElement>(null);
  const downloadSectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Handle scrolling to sections when the page loads with a hash in the URL
  useEffect(() => {
    // Get the hash from the URL (e.g., #blog, #other, #download)
    const hash = location.hash.slice(1); // Remove the # character
    
    if (hash) {
      // Add a slight delay to ensure the page is fully loaded
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.hash]);

  // Set visibility after component mounts for animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-out ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              <span>홈으로 돌아가기</span>
            </Link>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">GPTS 이용하기</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-full">
            알파블로그에서 제공하는 다양한 GPTS 도구들을 이용해보세요. 블로그 작성부터 SEO 최적화까지 AI의 도움을 받아보세요.
          </p>
          
          <div className={`stagger-animation ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <div id="blog" ref={blogSectionRef} className="transition-all duration-500 delay-100">
              <GPTSBlogSection />
            </div>
            
            <div id="other" ref={otherSectionRef} className="transition-all duration-500 delay-200">
              <GPTSOtherSection />
            </div>
            
            <div id="download" ref={downloadSectionRef} className="transition-all duration-500 delay-300">
              <GPTSDownloadSection />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
