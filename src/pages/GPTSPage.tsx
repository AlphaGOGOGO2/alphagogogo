import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GPTSBeginnerSection } from "@/components/gpts/GPTSBeginnerSection";
import { GPTSBlogSection } from "@/components/gpts/GPTSBlogSection";
import { GPTSOtherSection } from "@/components/gpts/GPTSOtherSection";
import { GPTSDownloadSection } from "@/components/gpts/GPTSDownloadSection";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Banner } from "@/components/Banner";
import { AdSense } from "@/components/AdSense";

export default function GPTSPage() {
  const location = useLocation();
  const beginnerSectionRef = useRef<HTMLDivElement>(null);
  const blogSectionRef = useRef<HTMLDivElement>(null);
  const otherSectionRef = useRef<HTMLDivElement>(null);
  const downloadSectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hash = location.hash.slice(1);
    
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.hash]);

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
          
          <Banner className="mb-10" />
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">GPTS 이용하기</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-full">
            알파블로그에서 제공하는 다양한 GPTS 도구들을 이용해보세요. 블로그 작성부터 SEO 최적화까지 AI의 도움을 받아보세요.
          </p>

          <div className="mb-12">
            <AdSense adFormat="horizontal" style={{ minHeight: "90px" }} />
          </div>
          
          <div className={`stagger-animation ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <div id="beginner" ref={beginnerSectionRef} className="transition-all duration-500 delay-100">
              <GPTSBeginnerSection />
            </div>
            
            <div id="blog" ref={blogSectionRef} className="transition-all duration-500 delay-200">
              <GPTSBlogSection />
            </div>
            
            <div id="other" ref={otherSectionRef} className="transition-all duration-500 delay-300">
              <GPTSOtherSection />
            </div>
            
            <div id="download" ref={downloadSectionRef} className="transition-all duration-500 delay-400">
              <GPTSDownloadSection />
            </div>
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
