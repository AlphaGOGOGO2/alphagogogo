
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

// 사이트 기본 도메인
const SITE_DOMAIN = 'https://alphagogogo.com';

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // 페이지 로드 시 상단으로 부드럽게 스크롤
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    
    // 페이지 전환 클래스 추가
    document.body.classList.add("page-transition");
    
    return () => {
      document.body.classList.remove("page-transition");
    };
  }, []);
  
  // 방문 기록 (최상단에서 실행)
  useRecordVisit();

  // 더 자세한 홈페이지 구조화 데이터
  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "알파고고고",
    "alternateName": "알파블로그",
    "url": SITE_DOMAIN,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_DOMAIN}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    "description": "최신 AI 뉴스, 연구 및 인사이트로 업데이트하세요. 알파고고고는 인공지능 발전에 대한 최신 정보를 제공합니다.",
    "keywords": "알파고고고,알파고,알파GOGOGO,유튜브 알파GOGOGO,유튜브 알파고고고,본질을 찾아서,블로그,블로그 자동화,알파블로그,블로그 GPTS,챗GPT,블로그 AI,블로그 GPT,챗지피티,블로그자동,블로그 글쓰기,블로그 AI글,러버블 DEV,Lovable DEV,러버블 DEV 회원가입,러버블 DEV 가격,러버블 DEV 요금제,AI 앱 개발,노코드 웹앱 만들기,AI 웹 개발,러버블 DEV 사용법,AI 앱 만들기,노코드 앱 제작,URL 단축,무료 URL 단축,유튜브 자막,유튜브 자막 다운로드,블로그 버튼 생성,버튼 생성기,링크 버튼 생성,링크 버튼"
  };

  // 조직 스키마 추가
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "알파고고고",
    "url": SITE_DOMAIN,
    "logo": {
      "@type": "ImageObject",
      "url": "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png",
      "width": 112,
      "height": 112
    },
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

  // breadcrumb 데이터 (홈 페이지 브레드크럼 추가)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "홈",
        "item": SITE_DOMAIN
      }
    ]
  };
  
  // 모든 스키마 객체를 SEO 컴포넌트를 위해 배열로 결합
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [homePageSchema, organizationSchema, breadcrumbSchema]
  };
  
  return (
    <div className="min-h-screen flex flex-col w-full">
      <SEO 
        title="알파고고고 - 최신 AI 소식 & 인사이트"
        canonicalUrl={SITE_DOMAIN}
        structuredData={combinedSchema}
        ogImage="https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//og%20image.png"
        keywords="알파고고고,알파고,알파GOGOGO,유튜브 알파GOGOGO,유튜브 알파고고고,본질을 찾아서,블로그,블로그 자동화,알파블로그,블로그 GPTS,챗GPT,블로그 AI,블로그 GPT,챗지피티,블로그자동,블로그 글쓰기,블로그 AI글,러버블 DEV,Lovable DEV,러버블 DEV 회원가입,러버블 DEV 가격,러버블 DEV 요금제,AI 앱 개발,노코드 웹앱 만들기,AI 웹 개발,러버블 DEV 사용법,AI 앱 만들기,노코드 앱 제작,URL 단축,무료 URL 단축,유튜브 자막,유튜브 자막 다운로드,블로그 버튼 생성,버튼 생성기,링크 버튼 생성,링크 버튼"
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
