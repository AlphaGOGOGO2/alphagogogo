
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link2, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Banner } from "@/components/Banner";
import { SEO } from "@/components/SEO";

const SITE_DOMAIN = 'https://alphagogogo.com';

export default function ServicesPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "서비스 - 알파고고고",
    "description": "알파블로그에서 제공하는 다양한 실용적인 서비스를 이용해보세요. 블로그 버튼 생성기 등 유용한 도구들을 제공합니다.",
    "url": `${SITE_DOMAIN}/services`,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "홈",
          "item": SITE_DOMAIN
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "서비스",
          "item": `${SITE_DOMAIN}/services`
        }
      ]
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="서비스 - 알파고고고"
        description="알파블로그에서 제공하는 다양한 실용적인 서비스를 이용해보세요. 블로그 버튼 생성기 등 유용한 도구들을 제공합니다."
        canonicalUrl={`${SITE_DOMAIN}/services`}
        keywords="서비스, 블로그 도구, 버튼 생성기, 알파고고고, 알파블로그"
        structuredData={structuredData}
      />
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
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">서비스</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-full">
            알파블로그에서 제공하는 다양한 실용적인 서비스를 이용해보세요.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 mb-16">
            <Card 
              className={`shadow-md hover:shadow-lg transition-shadow border-0 overflow-hidden flex flex-col`}
              style={{ 
                animation: `fade-in 0.6s ease-out forwards`,
                opacity: 0 
              }}
            >
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-t-lg py-8">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <MousePointerClick className="text-white" size={24} />
                  블로그 버튼 생성기
                </CardTitle>
                <CardDescription className="text-white/90 text-base mt-2">
                  블로그용 커스텀 HTML 버튼을 쉽게 디자인하고 생성할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 pb-6 px-6 flex-grow flex flex-col">
                <p className="text-gray-700 mb-6 flex-grow">
                  색상, 폰트, 크기 등을 원하는 대로 커스터마이징하여 블로그에 사용할 수 있는 매력적인 버튼 HTML 코드를 생성합니다.
                </p>
                <Link to="/blog-button-creator">
                  <Button className="w-full bg-purple-700 hover:bg-purple-800 text-white transition-all duration-300">
                    <ExternalLink size={16} className="mr-2" />
                    서비스 이용하기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
