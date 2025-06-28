import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ServiceTabs } from "@/components/ai-partnership/ServiceTabs";
import { InviteLinkForm } from "@/components/ai-partnership/InviteLinkForm";
import { InviteLinkList } from "@/components/ai-partnership/InviteLinkList";
import { Banner } from "@/components/Banner";
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

        // Json 타입을 string[]로 변환
        const transformedData = data?.map(service => ({
          ...service,
          benefits: Array.isArray(service.benefits) ? service.benefits : []
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
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
        <Helmet>
          <title>AI품앗이 - 초대링크 공유 플랫폼 | 알파블로그</title>
          <meta 
            name="description" 
            content="AI 서비스 초대링크를 공유하고 서로 혜택을 받는 품앗이 플랫폼입니다." 
          />
        </Helmet>
        
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
      <Helmet>
        <title>AI품앗이 - 초대링크 공유 플랫폼 | 알파블로그</title>
        <meta 
          name="description" 
          content="AI 서비스 초대링크를 공유하고 서로 혜택을 받는 품앗이 플랫폼입니다. 러버블, 마누스 등 다양한 AI 서비스의 초대 혜택을 함께 나누세요." 
        />
        <meta name="keywords" content="AI, 초대링크, 품앗이, 러버블, 마누스, 크레딧" />
      </Helmet>
      
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
                AI 서비스 초대링크를 공유하고 서로 혜택을 받는 품앗이 플랫폼입니다.<br />
                함께 크레딧을 받고 AI 서비스를 더 많이 이용해보세요!
              </p>
            </div>

            <ServiceTabs 
              services={services}
              selectedService={selectedService}
              onServiceChange={setSelectedService}
            />

            {currentService && (
              <div className="mt-8 bg-purple-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  {currentService.display_name} 초대 혜택
                </h3>
                <p className="text-purple-700 mb-3">{currentService.description}</p>
                <ul className="space-y-1">
                  {currentService.benefits.map((benefit, index) => (
                    <li key={index} className="text-purple-700 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-8">
              <InviteLinkForm 
                selectedService={selectedService}
                serviceConfig={currentService}
              />
              
              <InviteLinkList selectedService={selectedService} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
