
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
    },
    "keywords": "알파고고고,알파고,알파GOGOGO,유튜브 알파GOGOGO,유튜브 알파고고고,본질을 찾아서,블로그,블로그 자동화,알파블로그,블로그 GPTS,챗GPT,블로그 AI,블로그 GPT,챗지피티,블로그자동,블로그 글쓰기,블로그 AI글"
  };
  
  return (
    <div className="min-h-screen flex flex-col w-full">
      <SEO 
        title="알파블로그 - 최신 AI 소식 & 인사이트"
        canonicalUrl="https://alphablog.app"
        structuredData={structuredData}
        ogImage="https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png"
        keywords="알파고고고,알파고,알파GOGOGO,유튜브 알파GOGOGO,유튜브 알파고고고,본질을 찾아서,블로그,블로그 자동화,알파블로그,블로그 GPTS,챗GPT,블로그 AI,블로그 GPT,챗지피티,블로그자동,블로그 글쓰기,블로그 AI글"
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
