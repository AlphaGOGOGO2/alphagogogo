
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/Footer";
import { Mail, Handshake, Megaphone, Code, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function BusinessInquiryPage() {
  return (
    <>
      <SEO 
        title="비즈니스 문의 | 알파블로그" 
        description="알파블로그에 비즈니스 제휴 및 협업에 대한 문의를 보내주세요." 
      />
      
      <Navbar />
      
      <main className="min-h-screen bg-gradient-to-b from-white to-purple-50/30">
        {/* 헤더 섹션 */}
        <section className="pt-24 pb-12 md:pt-32 md:pb-16 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-purple mb-4">
              비즈니스 문의
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              알파블로그와 함께 성장할 수 있는 파트너십과 협업 기회를 찾고 계신가요? 
              아래 제안 분야를 확인하시고 이메일로 문의해 주시면 빠른 시일 내에 답변 드리겠습니다.
            </p>
          </div>
        </section>
        
        {/* 연락처 정보 */}
        <section className="pb-12 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/80 shadow-lg backdrop-blur-sm rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-100">
                <Mail className="h-8 w-8 text-purple-700" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-800 mb-2">이메일 문의</h3>
                <p className="text-lg font-medium text-purple-700">skssk01033@naver.com</p>
                <p className="text-gray-500 mt-2">월-금: 10:00 - 18:00 (공휴일 제외)</p>
              </div>
              <div className="md:ml-auto">
                <Button
                  onClick={() => window.location.href = 'mailto:skssk01033@naver.com'}
                  className="bg-purple-700 hover:bg-purple-800"
                >
                  메일 보내기 <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* 비즈니스 제안 섹션 */}
        <section className="pb-24 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-500">
                비즈니스 제안 분야
              </span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* 콘텐츠 제휴 */}
              <BusinessCard 
                title="콘텐츠 제휴"
                icon={<Handshake className="h-8 w-8 text-purple-700" />}
                bgColor="bg-soft-purple"
                description="양질의 콘텐츠를 함께 만들고 공유하세요."
                items={[
                  "콘텐츠 교차 게시 및 홍보",
                  "공동 블로그 포스팅 및 가이드",
                  "전문가 인터뷰 및 기고문",
                  "AI 관련 인사이트 공유"
                ]}
              />
              
              {/* 광고 및 스폰서십 */}
              <BusinessCard 
                title="광고 및 스폰서십"
                icon={<Megaphone className="h-8 w-8 text-purple-700" />}
                bgColor="bg-soft-peach"
                description="타겟 오디언스에게 효과적으로 도달하세요."
                items={[
                  "배너 및 디스플레이 광고",
                  "스폰서 콘텐츠 제작",
                  "뉴스레터 광고 삽입",
                  "이벤트 및 웨비나 스폰서십"
                ]}
              />
              
              {/* SEO 웹페이지 개발 */}
              <BusinessCard 
                title="SEO 웹페이지 개발"
                icon={<Code className="h-8 w-8 text-purple-700" />}
                bgColor="bg-soft-blue"
                description="검색엔진 최적화된 웹페이지로 비즈니스를 성장시키세요."
                items={[
                  "사이트 SEO 진단 및 컨설팅",
                  "검색엔진 최적화 개발",
                  "콘텐츠 SEO 전략 수립",
                  "기술적 SEO 구현"
                ]}
              />
              
              {/* 기타 협업 제안 */}
              <BusinessCard 
                title="기타 협업 제안"
                icon={<Handshake className="h-8 w-8 text-purple-700" />}
                bgColor="bg-soft-yellow"
                description="새롭고 창의적인 협업 아이디어를 제안해주세요."
                items={[
                  "AI 기술 관련 리서치 협업",
                  "멤버십 프로그램 연계",
                  "커뮤니티 이벤트 공동 주최",
                  "크리에이티브 프로젝트 제안"
                ]}
              />
            </div>
            
            {/* CTA 섹션 */}
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-semibold text-purple-800 mb-4">
                성공적인 협업을 기대합니다
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                알파블로그는 항상 새로운 아이디어와 협업에 열려 있습니다. <br />
                여러분의 비즈니스와 함께 성장할 수 있는 기회를 찾고 있습니다.
              </p>
              <Button 
                onClick={() => window.location.href = 'mailto:skssk01033@naver.com?subject=[비즈니스 제안]'} 
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:opacity-90 transition-all px-8 py-6 text-lg"
              >
                지금 문의하기 <Mail className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}

// 비즈니스 카드 컴포넌트
interface BusinessCardProps {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  description: string;
  items: string[];
}

const BusinessCard = ({ title, icon, bgColor, description, items }: BusinessCardProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
      <div className={cn("p-6", bgColor)}>
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-700 mb-4">{description}</p>
      </div>
      <CardContent className="bg-white p-6">
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
