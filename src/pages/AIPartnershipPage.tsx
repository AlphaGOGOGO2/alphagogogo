
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ServiceTabs } from "@/components/ai-partnership/ServiceTabs";
import { InviteLinkForm } from "@/components/ai-partnership/InviteLinkForm";
import { InviteLinkList } from "@/components/ai-partnership/InviteLinkList";
import { aiPartnershipServices } from "@/config/navigation";
import { Banner } from "@/components/Banner";

export default function AIPartnershipPage() {
  const [selectedService, setSelectedService] = useState<string>("lovable");
  const currentService = aiPartnershipServices.find(service => service.value === selectedService);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>AI품앗이 - 초대링크 공유 플랫폼 | 알파블로그</title>
        <meta 
          name="description" 
          content="AI 서비스 초대링크를 공유하고 서로 혜택을 받는 품앗이 플랫폼입니다. 러버블, 젠스파크 등 다양한 AI 서비스의 초대 혜택을 함께 나누세요." 
        />
        <meta name="keywords" content="AI, 초대링크, 품앗이, 러버블, 젠스파크, 크레딧" />
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
              services={aiPartnershipServices}
              selectedService={selectedService}
              onServiceChange={setSelectedService}
            />

            {currentService && (
              <div className="mt-8 bg-purple-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  {currentService.name} 초대 혜택
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <InviteLinkForm 
                  selectedService={selectedService}
                  serviceConfig={currentService}
                />
              </div>
              
              <div className="lg:col-span-2">
                <InviteLinkList selectedService={selectedService} />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
