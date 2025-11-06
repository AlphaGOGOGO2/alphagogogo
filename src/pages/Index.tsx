
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/landing/Hero";
import { FeaturedPosts } from "@/components/landing/FeaturedPost";
import { GPTSUsage } from "@/components/landing/GPTSUsage";
import { Services } from "@/components/landing/Services";
import { Community } from "@/components/landing/Community";
import { Resources } from "@/components/landing/Resources";
import { AIGuide } from "@/components/landing/AIGuide";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { StructuredData } from "@/components/seo/StructuredData";
import { BlogAIBanner } from "@/components/banner/BlogAIBanner";

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
        "url": "/images/logo.png",
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
        title="알파고고고 - 최신 AI 소식, GPTS 도구, 블로그 자동화 서비스 | 비개발자를 위한 AI 가이드"
        description="AI를 이해하는 새로운 관점으로 비개발자와 비전문인을 위한 실용적인 AI 가이드를 제공하는 알파고고고입니다. 최신 AI 뉴스와 기술 트렌드, 챗GPT·클로드·제미나이 활용법, 무료 GPTS 도구 모음, 블로그 자동화 서비스, SEO 최적화 가이드, AI 학습 자료실, 실시간 커뮤니티까지 - AI 시대를 살아가는 모든 분들이 필요한 정보와 도구를 한 곳에서 만나보세요. 퍼스널 브랜딩부터 비즈니스 활용까지 AI의 모든 것을 다룹니다."
        canonicalUrl={SITE_DOMAIN}
        structuredData={combinedSchema}
        ogImage="/images/ogimage.png"
        keywords="알파고고고,알파블로그,알파고,알파GOGOGO,유튜브 알파GOGOGO,본질을 찾아서,퍼스널 브랜딩,personal branding,AI,인공지능,artificial intelligence,챗GPT,ChatGPT,제미나이,Gemini,클로드,Claude,커서AI,Cursor AI,러버블 DEV,Lovable DEV,노코드,no-code,웹개발,web development,AI 블로그,AI blog,블로그 글쓰기,blog writing,블로그 자동화,blog automation,블로그 AI,블로그 GPT,테크 블로그,tech blog,인공지능 뉴스,AI news,기술 트렌드,tech trends,머신러닝,machine learning,딥러닝,deep learning,LLM,대화형 AI,conversational AI,AI 도구,AI tools,프롬프트 엔지니어링,prompt engineering,AI 리뷰,AI review,테크 리뷰,tech review,개발 도구,development tools,코딩,coding,프로그래밍,programming,스타트업,startup,테크 인사이트,tech insights,디지털 트랜스포메이션,digital transformation,URL 단축,무료 URL 단축,유튜브 자막,유튜브 자막 다운로드,블로그 버튼 생성,버튼 생성기,링크 버튼 생성,링크 버튼,GPTS 도구,AI 가이드,SEO 최적화,AI 학습,AI 커뮤니티,AI 자료실"
      />
      <Navbar />
      <main>
        <section className="relative">
          <h1 className="sr-only">알파고고고 - AI를 이해하는 새로운 관점으로 최신 인공지능 소식과 실용적인 가이드를 제공하는 플랫폼</h1>
          
          {/* 메인 소개 콘텐츠 - 250단어 이상 실제 콘텐츠 */}
          <div className="sr-only">
            <h2>알파고고고에 오신 것을 환영합니다</h2>
            <p>
              알파고고고는 비개발자와 일반인을 위한 AI 전문 플랫폼입니다. 복잡한 인공지능 기술을 쉽고 이해하기 쉽게 설명하여, 
              누구나 AI의 발전과 활용법을 배울 수 있도록 돕습니다. 우리는 최신 AI 뉴스, 기술 트렌드, 그리고 실무에서 바로 
              활용할 수 있는 프롬프트 엔지니어링 가이드를 제공합니다.
            </p>
            <p>
              특히 ChatGPT, Claude, Gemini와 같은 대화형 AI 도구들의 효과적인 사용법부터, 블로그 자동화, 
              콘텐츠 생성, 비즈니스 활용까지 폭넓은 AI 활용 사례를 다룹니다. 또한 무료로 이용할 수 있는 
              GPTS 도구 모음과 블로그 자동화 서비스를 통해 개인과 기업이 AI를 실무에 적용할 수 있도록 지원합니다.
            </p>
            <p>
              알파고고고는 단순한 정보 제공을 넘어서, 실시간 커뮤니티를 통한 AI 학습과 경험 공유, 
              그리고 체계적인 AI 교육 자료를 제공하여 한국의 AI 생태계 발전에 기여하고자 합니다. 
              AI 시대를 준비하는 모든 분들과 함께 성장하는 플랫폼이 되겠습니다.
            </p>
            
            <h3>주요 서비스 소개</h3>
            <ul>
              <li><a href="/blog">AI 블로그</a> - 최신 인공지능 소식과 기술 리뷰</li>
              <li><a href="/gpts">무료 GPTS 도구</a> - 생산성 향상을 위한 AI 도구 모음</li>
              <li><a href="/services">블로그 자동화 서비스</a> - AI 기반 콘텐츠 생성 도구</li>
              <li><a href="/community">AI 커뮤니티</a> - 실시간 학습과 경험 공유</li>
              <li><a href="/resources">AI 학습 자료</a> - 체계적인 AI 교육 콘텐츠</li>
            </ul>
            
            <h3>외부 참고 자료</h3>
            <p>
              더 깊이 있는 AI 학습을 원하신다면 <a href="https://openai.com" target="_blank" rel="noopener noreferrer">OpenAI 공식 사이트</a>나 
              <a href="https://developers.google.com/machine-learning" target="_blank" rel="noopener noreferrer">Google AI 개발자 가이드</a>를 참고하시기 바랍니다.
            </p>
          </div>
          
          <Hero />
        </section>

        <BlogAIBanner />

        <FeaturedPosts />
        <GPTSUsage />
        <Services />
        <Community />
        <Resources />
        <AIGuide />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
