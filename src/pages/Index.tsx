
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
import { StructuredData } from "@/components/seo/StructuredData";

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


  // 홈페이지 웹사이트 스키마
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
    "keywords": "알파고고고,알파블로그,알파고,알파GOGOGO,유튜브 알파GOGOGO,본질을 찾아서,퍼스널 브랜딩,AI,인공지능,챗GPT,제미나이,클로드,커서AI,러버블 DEV,노코드,AI 블로그,블로그 글쓰기,테크 블로그,머신러닝,딥러닝,LLM,AI 도구,프롬프트 엔지니어링,테크 리뷰,개발 도구"
  };

  // 조직 스키마
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "알파고고고",
    "url": SITE_DOMAIN,
      "logo": {
        "@type": "ImageObject",
        "url": "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images/logo.png",
      "width": 200,
      "height": 200
    },
    "sameAs": [
      "https://www.youtube.com/@alphagogogo",
      "https://twitter.com/alphagogogo"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "url": `${SITE_DOMAIN}/business-inquiry`
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
        description="AI를 이해하는 새로운 관점, 비개발자와 비전문인의 시선으로 바라보는 AI 트렌드와 인사이트를 제공합니다."
        canonicalUrl={SITE_DOMAIN}
        structuredData={combinedSchema}
        ogImage="https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//ogimage.png"
        keywords="알파고고고,알파블로그,알파고,알파GOGOGO,유튜브 알파GOGOGO,본질을 찾아서,퍼스널 브랜딩,personal branding,AI,인공지능,artificial intelligence,챗GPT,ChatGPT,제미나이,Gemini,클로드,Claude,커서AI,Cursor AI,러버블 DEV,Lovable DEV,노코드,no-code,웹개발,web development,AI 블로그,AI blog,블로그 글쓰기,blog writing,블로그 자동화,blog automation,블로그 AI,블로그 GPT,테크 블로그,tech blog,인공지능 뉴스,AI news,기술 트렌드,tech trends,머신러닝,machine learning,딥러닝,deep learning,LLM,대화형 AI,conversational AI,AI 도구,AI tools,프롬프트 엔지니어링,prompt engineering,AI 리뷰,AI review,테크 리뷰,tech review,개발 도구,development tools,코딩,coding,프로그래밍,programming,스타트업,startup,테크 인사이트,tech insights,디지털 트랜스포메이션,digital transformation,URL 단축,무료 URL 단축,유튜브 자막,유튜브 자막 다운로드,블로그 버튼 생성,버튼 생성기,링크 버튼 생성,링크 버튼"
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
