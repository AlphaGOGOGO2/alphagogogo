
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/landing/Hero";
import { FeaturedPosts } from "@/components/landing/FeaturedPost";
import { GPTSUsage } from "@/components/landing/GPTSUsage";
import { Services } from "@/components/landing/Services";
import { Community } from "@/components/landing/Community";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useRecordVisit } from "@/hooks/useRecordVisit";
import { AdSense } from "@/components/AdSense";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
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
  
  // 방문 기록 (최상단에서 실행)
  useRecordVisit();

  // HomePage structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "알파고고고",
    "alternateName": "알파블로그",
    "url": "https://alphagogogo.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://alphagogogo.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "keywords": "알파고고고,알파고,알파GOGOGO,유튜브 알파GOGOGO,유튜브 알파고고고,본질을 찾아서,블로그,블로그 자동화,알파블로그,블로그 GPTS,챗GPT,블로그 AI,블로그 GPT,챗지피티,블로그자동,블로그 글쓰기,블로그 AI글,러버블 DEV,Lovable DEV,러버블 DEV 회원가입,러버블 DEV 가격,러버블 DEV 요금제,AI 앱 개발,노코드 웹앱 만들기,AI 웹 개발,러버블 DEV 사용법,AI 앱 만들기,노코드 앱 제작,URL 단축,무료 URL 단축,유튜브 자막,유튜브 자막 다운로드,블로그 버튼 생성,버튼 생성기,링크 버튼 생성,링크 버튼"
  };

  // Add organization schema for sitewide identity
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "알파고고고",
    "url": "https://alphagogogo.com",
    "logo": "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png",
    "sameAs": [
      "https://youtube.com/@alphagogogo",
      "https://twitter.com/alphagogogo"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "support@alphagogogo.com"
    }
  };
  
  // Combine both schema objects in an array for the SEO component
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [structuredData, organizationSchema]
  };
  
  return (
    <div className="min-h-screen flex flex-col w-full">
      <SEO 
        title="알파고고고 - 최신 AI 소식 & 인사이트"
        canonicalUrl="https://alphagogogo.com"
        structuredData={combinedSchema}
        ogImage="https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//og%20image.png"
        keywords="알파고고고,알파고,알파GOGOGO,유튜브 알파GOGOGO,유튜브 알파고고고,본질을 찾아서,블로그,블로그 자동화,알파블로그,블로그 GPTS,챗GPT,블로그 AI,블로그 GPT,챗지피티,블로그자동,블로그 글쓰기,블로그 AI글,러버블 DEV,Lovable DEV,러버블 DEV 회원가입,러버블 DEV 가격,러버블 DEV 요금제,AI 앱 개발,노코드 웹앱 만들기,AI 웹 개발,러버블 DEV 사용법,AI 앱 만들기,노코드 앱 제작,URL 단축,무료 URL 단축,유튜브 자막,유튜브 자막 다운로드,블로그 버튼 생성,버튼 생성기,링크 버튼 생성,링크 버튼"
      />
      <Navbar />
      <main>
        <Hero />
        <FeaturedPosts />
        {/* AdSense 배너 가운데 정렬 */}
        <div className="flex justify-center my-12">
          <AdSense adFormat="horizontal" style={{ minHeight: "90px" }} />
        </div>
        <GPTSUsage />
        {/* 두 번째 AdSense 배너도 가운데 정렬 */}
        <div className="flex justify-center my-12">
          <AdSense adFormat="horizontal" style={{ minHeight: "90px" }} />
        </div>
        <Services />
        <Community />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
