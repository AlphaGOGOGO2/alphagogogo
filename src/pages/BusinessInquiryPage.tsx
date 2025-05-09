
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/Footer";
import { Mail, Handshake, Megaphone, Code, ExternalLink, FileText, Users, Globe, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
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
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              알파블로그와 함께 성장할 수 있는 파트너십과 협업 기회를 찾고 계신가요? 
              아래 제안 분야를 확인하시고 이메일로 문의해 주시면 빠른 시일 내에 답변 드리겠습니다.
            </p>
          </div>
        </section>
        
        {/* 연락처 정보 */}
        <section className="pb-12 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/80 shadow-lg backdrop-blur-sm rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-center gap-6 mb-16 hover:shadow-xl transition-all duration-300 border border-purple-100">
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
                  onClick={() => window.location.href = 'mailto:skssk01033@naver.com?subject=[비즈니스 문의]'}
                  className="bg-purple-700 hover:bg-purple-800"
                >
                  메일 보내기 <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* 비즈니스 제안 섹션 - 가로형 레이아웃 */}
        <section className="pb-24 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-500">
                비즈니스 제안 분야
              </span>
            </h2>
            
            {/* 콘텐츠 제휴 */}
            <div className="mb-16 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 bg-soft-purple p-8 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                      <Handshake className="h-6 w-6 text-purple-700" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">콘텐츠 제휴</h3>
                  </div>
                  <p className="text-gray-700 mb-4">양질의 콘텐츠를 함께 만들고 공유하여 상호 가치를 높이는 파트너십입니다.</p>
                </div>
                <div className="lg:w-2/3 p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">콘텐츠 교차 게시 및 홍보</h4>
                        <p className="text-gray-600 text-sm">각 플랫폼의 특성을 살린 콘텐츠 공유로 독자층 확장</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">공동 블로그 포스팅</h4>
                        <p className="text-gray-600 text-sm">전문성을 결합한 심층적인 콘텐츠 제작과 배포</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">전문가 인터뷰 및 기고문</h4>
                        <p className="text-gray-600 text-sm">업계 전문가의 인사이트를 담은 고급 콘텐츠 제작</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">AI 관련 협업 웨비나</h4>
                        <p className="text-gray-600 text-sm">최신 AI 트렌드와 활용 방안에 대한 공동 웨비나 개최</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-right">
                    <Button 
                      onClick={() => window.location.href = 'mailto:skssk01033@naver.com?subject=[콘텐츠 제휴 문의]'} 
                      variant="outline" 
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      제휴 문의하기
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 광고 및 스폰서십 */}
            <div className="mb-16 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 bg-soft-peach p-8 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                      <Megaphone className="h-6 w-6 text-purple-700" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">광고 및 스폰서십</h3>
                  </div>
                  <p className="text-gray-700 mb-4">타겟 오디언스에게 효과적으로 도달하여 브랜드 인지도와 관심을 높입니다.</p>
                </div>
                <div className="lg:w-2/3 p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">배너 및 디스플레이 광고</h4>
                        <p className="text-gray-600 text-sm">AI 및 기술에 관심 있는 타겟 독자층에 효과적인 노출</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">스폰서 콘텐츠 제작</h4>
                        <p className="text-gray-600 text-sm">브랜드 메시지를 담은 고품질 네이티브 콘텐츠 제작</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">뉴스레터 광고 삽입</h4>
                        <p className="text-gray-600 text-sm">주목도 높은 뉴스레터를 통한 효과적인 메시지 전달</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">이벤트 및 웨비나 스폰서십</h4>
                        <p className="text-gray-600 text-sm">온라인 이벤트를 통한 브랜드 인지도 및 신뢰도 향상</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-right">
                    <Button 
                      onClick={() => window.location.href = 'mailto:skssk01033@naver.com?subject=[광고 및 스폰서십 문의]'} 
                      variant="outline" 
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      광고 문의하기
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* SEO 웹페이지 개발 */}
            <div className="mb-16 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 bg-soft-blue p-8 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                      <Code className="h-6 w-6 text-purple-700" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">SEO 웹페이지 개발</h3>
                  </div>
                  <p className="text-gray-700 mb-4">검색엔진 최적화된 웹사이트로 온라인 가시성을 높이고 비즈니스 성장을 돕습니다.</p>
                </div>
                <div className="lg:w-2/3 p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">사이트 SEO 진단 및 컨설팅</h4>
                        <p className="text-gray-600 text-sm">현재 웹사이트의 SEO 상태 분석 및 개선 방안 제시</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">검색엔진 최적화 개발</h4>
                        <p className="text-gray-600 text-sm">구조적으로 최적화된 웹페이지 설계 및 구현</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">콘텐츠 SEO 전략 수립</h4>
                        <p className="text-gray-600 text-sm">키워드 분석 및 효과적인 콘텐츠 전략 개발</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">기술적 SEO 구현</h4>
                        <p className="text-gray-600 text-sm">사이트맵, 메타데이터, 스키마 마크업 등 기술적 요소 최적화</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-right">
                    <Button 
                      onClick={() => window.location.href = 'mailto:skssk01033@naver.com?subject=[SEO 개발 문의]'} 
                      variant="outline" 
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      개발 문의하기
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 기타 협업 제안 */}
            <div className="mb-16 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 bg-soft-yellow p-8 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                      <Users className="h-6 w-6 text-purple-700" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">기타 협업 제안</h3>
                  </div>
                  <p className="text-gray-700 mb-4">새로운 아이디어와 창의적인 파트너십으로 함께 성장하는 기회를 만들어보세요.</p>
                </div>
                <div className="lg:w-2/3 p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">AI 기술 관련 리서치 협업</h4>
                        <p className="text-gray-600 text-sm">AI 기술 발전에 관한 최신 리서치 및 연구 파트너십</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">멤버십 프로그램 연계</h4>
                        <p className="text-gray-600 text-sm">상호 혜택을 제공하는 멤버십 프로그램 구축</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">커뮤니티 이벤트 공동 주최</h4>
                        <p className="text-gray-600 text-sm">온/오프라인 커뮤니티 활성화를 위한 공동 이벤트 기획</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">크리에이티브 프로젝트 제안</h4>
                        <p className="text-gray-600 text-sm">혁신적인 아이디어를 실현하는 창의적 프로젝트 협업</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-right">
                    <Button 
                      onClick={() => window.location.href = 'mailto:skssk01033@naver.com?subject=[협업 제안]'} 
                      variant="outline" 
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      협업 제안하기
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 협업 프로세스 섹션 추가 */}
            <div className="mb-16">
              <h3 className="text-xl md:text-2xl font-semibold text-purple-800 mb-8 text-center">
                협업 프로세스
              </h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center relative">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-5 w-5 text-purple-700" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">01. 문의</h4>
                  <p className="text-gray-600 text-sm">이메일을 통해 비즈니스 제안 내용과 목표를 공유해 주세요.</p>
                  {/* 연결선 (모바일에서는 숨김) */}
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-purple-100 -z-10"></div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center relative">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-5 w-5 text-purple-700" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">02. 제안 검토</h4>
                  <p className="text-gray-600 text-sm">접수된 제안을 검토하고 가능성을 평가합니다.</p>
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-purple-100 -z-10"></div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center relative">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                    <PenTool className="h-5 w-5 text-purple-700" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">03. 계획 수립</h4>
                  <p className="text-gray-600 text-sm">구체적인 협업 계획과 목표를 함께 설정합니다.</p>
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-purple-100 -z-10"></div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-5 w-5 text-purple-700" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">04. 협업 실행</h4>
                  <p className="text-gray-600 text-sm">합의된 계획에 따라 협업을 진행하고 결과를 측정합니다.</p>
                </div>
              </div>
            </div>
            
            {/* CTA 섹션 */}
            <div className="text-center bg-purple-50 p-8 md:p-12 rounded-2xl shadow-sm">
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
