
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/landing/Hero";
import { FeaturedPosts } from "@/components/landing/FeaturedPost";
import { GPTSUsage } from "@/components/landing/GPTSUsage";
import { Services } from "@/components/landing/Services";
import { Community } from "@/components/landing/Community";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const Index = () => {
  useEffect(() => {
    // Smooth scroll to top when page loads
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    
    // Add page transition class
    document.body.classList.add("page-transition");
    
    return () => {
      document.body.classList.remove("page-transition");
    };
  }, []);
  
  // HomePage structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "알파블로그",
    "url": "https://alphablog.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://alphablog.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col w-full">
      <SEO 
        title="알파블로그 - 최신 AI 소식 & 인사이트"
        canonicalUrl="https://alphablog.app"
        structuredData={structuredData}
      />
      <Navbar />
      <main>
        <Hero />
        <FeaturedPosts />
        <GPTSUsage />
        <Services />
        <Community />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
