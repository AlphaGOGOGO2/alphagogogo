
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ServiceTabs } from "@/components/ai-partnership/ServiceTabs";
import { InviteLinkForm } from "@/components/ai-partnership/InviteLinkForm";
import { InviteLinkList } from "@/components/ai-partnership/InviteLinkList";
import { Banner } from "@/components/Banner";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";

interface AIService {
  id: string;
  name: string;
  display_name: string;
  url_pattern: string;
  description: string;
  benefits: string[];
  is_active: boolean;
}

export default function AIPartnershipPage() {
  const [selectedService, setSelectedService] = useState<string>("lovable");
  const [services, setServices] = useState<AIService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentService = services.find(service => service.name === selectedService);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('ai_services')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('서비스 조회 오류:', error);
          return;
        }

        // Json 타입을 string[]로 안전하게 변환
        const transformedData = data?.map(service => ({
          ...service,
          benefits: Array.isArray(service.benefits) 
            ? service.benefits.map(benefit => String(benefit))
            : []
        })) || [];

        setServices(transformedData);
        
        // 첫 번째 활성 서비스를 기본 선택으로 설정
        if (transformedData && transformedData.length > 0) {
          setSelectedService(transformedData[0].name);
        }
      } catch (error) {
        console.error('서비스 조회 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();

    // 실시간 업데이트 구독
    const channel = supabase
      .channel('ai_services_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_services'
        },
        () => {
          fetchServices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 구조화 데이터 생성
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "AI품앗이 - AI 서비스 초대링크 공유 플랫폼",
    "description": "AI 서비스 무료 크레딧을 받을 수 있는 초대링크를 공유하고 추천인 혜택을 받는 품앗이 플랫폼입니다. 러버블, 마누스 등 다양한 AI 툴의 할인 혜택을 함께 나누세요.",
    "url": "https://alphagogogo.com/ai-partnership",
    "mainEntity": {
      "@type": "Service",
      "name": "AI품앗이",
      "description": "AI 서비스 초대링크 공유 서비스",
      "provider": {
        "@type": "Organization",
        "name": "알파고고고"
      },
      "areaServed": "KR",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "AI 서비스 프로모션",
        "itemListElement": services.map((service, index) => ({
          "@type": "Offer",
          "position": index + 1,
          "name": `${service.display_name} 초대 혜택`,
          "description": service.description,
          "category": "AI 서비스 프로모션"
        }))
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEO
          title="AI품앗이 - AI 서비스 무료 크레딧 초대링크 공유 플랫폼"
          description="AI 서비스 무료 크레딧을 받을 수 있는 초대링크를 공유하고 추천인 혜택을 받는 품앗이 플랫폼입니다."
          keywords="AI 품앗이,AI 무료 크레딧,AI 초대링크,AI 추천인 프로그램,AI 할인,AI 무료 체험,생성형 AI 무료,AI 챗봇 무료,AI 이미지 생성 무료,AI 글쓰기 도구 할인,러버블 무료 크레딧,마누스 초대 코드,AI 툴 무료 사용법,AI 서비스 프로모션,AI 바우처,AI 지원금"
          canonicalUrl="/ai-partnership"
          structuredData={structuredData}
        />
        <Navbar />
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div>로딩 중...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEO
          title="AI품앗이 - AI 서비스 무료 크레딧 초대링크 공유 플랫폼"
          description="AI 서비스 무료 크레딧을 받을 수 있는 초대링크를 공유하고 추천인 혜택을 받는 품앗이 플랫폼입니다. 곧 새로운 AI 서비스가 추가될 예정입니다."
          keywords="AI 품앗이,AI 무료 크레딧,AI 초대링크,AI 추천인 프로그램,AI 할인,AI 무료 체험"
          canonicalUrl="/ai-partnership"
        />
        
        <Navbar />
        
        <main className="flex-grow pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Banner />
            
            <div className="py-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  AI품앗이
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  현재 이용 가능한 AI 서비스가 없습니다.<br />
                  곧 새로운 서비스가 추가될 예정입니다!
                </p>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="AI품앗이 - AI 서비스 무료 크레딧 초대링크 공유 플랫폼"
        description="AI 서비스 무료 크레딧을 받을 수 있는 초대링크를 공유하고 추천인 혜택을 받는 품앗이 플랫폼입니다. 러버블, 마누스 등 다양한 AI 툴의 할인 혜택을 함께 나누세요."
        keywords="AI 품앗이,AI 무료 크레딧,AI 초대링크,AI 추천인 프로그램,AI 할인,AI 무료 체험,생성형 AI 무료 크레딧,AI 챗봇 무료 이용,AI 이미지 생성 무료,AI 글쓰기 도구 할인,AI 음성 변환 무료,AI 영상 편집 크레딧,러버블 무료 크레딧,마누스 초대 코드,AI 툴 무료 사용법,AI 서비스 프로모션,AI 솔루션,인공지능 도구,AI 플랫폼,AI 바우처,AI 지원금,친구 초대 할인,신규 가입 혜택"
        canonicalUrl="/ai-partnership"
        structuredData={structuredData}
      />
      
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Banner />
          
          <div className="py-8">
            {/* 메인 헤더 섹션 */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                AI품앗이 - AI 서비스 무료 크레딧 받기
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
                AI 서비스 초대링크를 공유하고 서로 혜택을 받는 품앗이 플랫폼입니다.<br />
                함께 크레딧을 받고 AI 서비스를 더 많이 이용해보세요!
              </p>
              
              {/* 주요 혜택 강조 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">🎁 무료 크레딧</h3>
                  <p className="text-blue-700 text-sm">AI 서비스 초대링크를 통해 무료 크레딧을 받으세요</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">🤝 상호 혜택</h3>
                  <p className="text-green-700 text-sm">초대하는 사람과 받는 사람 모두 혜택을 받습니다</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">🚀 다양한 AI 툴</h3>
                  <p className="text-purple-700 text-sm">러버블, 마누스 등 인기 AI 서비스 지원</p>
                </div>
              </div>
            </div>

            {/* AI 서비스 탭 */}
            <ServiceTabs 
              services={services}
              selectedService={selectedService}
              onServiceChange={setSelectedService}
            />

            {/* 현재 선택된 서비스 혜택 정보 */}
            {currentService && (
              <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8 mb-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-purple-900 mb-2">
                    {currentService.display_name} 무료 크레딧 받기
                  </h2>
                  <p className="text-purple-700 text-lg">{currentService.description}</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    🎉 {currentService.display_name} 초대 혜택 상세
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentService.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start bg-gray-50 p-4 rounded-lg">
                        <span className="text-purple-600 mr-3 text-lg">✓</span>
                        <span className="text-gray-800">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 이용 방법 안내 */}
            <div className="bg-gray-50 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                AI 무료 크레딧 받는 방법
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">서비스 선택</h3>
                  <p className="text-sm text-gray-600">원하는 AI 서비스를 선택하세요</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">초대링크 이용</h3>
                  <p className="text-sm text-gray-600">다른 사용자의 초대링크로 가입하세요</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-600">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">크레딧 획득</h3>
                  <p className="text-sm text-gray-600">무료 크레딧을 받으세요</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-orange-600">4</span>
                  </div>
                  <h3 className="font-semibold mb-2">링크 등록</h3>
                  <p className="text-sm text-gray-600">내 초대링크도 등록해서 혜택을 받으세요</p>
                </div>
              </div>
            </div>

            {/* 초대링크 등록 폼 */}
            <div className="space-y-8">
              <InviteLinkForm 
                selectedService={selectedService}
                serviceConfig={currentService}
              />
              
              <InviteLinkList selectedService={selectedService} />
            </div>

            {/* FAQ 섹션 */}
            <div className="mt-12 bg-white rounded-lg border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                자주 묻는 질문 (FAQ)
              </h2>
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg mb-2">Q. AI품앗이는 무료인가요?</h3>
                  <p className="text-gray-600">네, 완전 무료입니다. 초대링크 공유와 이용 모두 무료로 제공됩니다.</p>
                </div>
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg mb-2">Q. 어떤 AI 서비스를 지원하나요?</h3>
                  <p className="text-gray-600">현재 러버블(Lovable), 마누스(Manus) 등 다양한 AI 서비스를 지원하며, 지속적으로 추가하고 있습니다.</p>
                </div>
                <div className="border-b pb-4">
                  <h3 className="font-semibbold text-lg mb-2">Q. 크레딧은 언제 지급되나요?</h3>
                  <p className="text-gray-600">각 AI 서비스의 정책에 따라 다르며, 일반적으로 가입 완료 후 즉시 또는 24시간 이내에 지급됩니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Q. 초대링크는 몇 번까지 사용할 수 있나요?</h3>
                  <p className="text-gray-600">각 AI 서비스마다 다르지만, 일반적으로 제한 없이 사용 가능합니다. 단, 중복 가입은 불가능합니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
