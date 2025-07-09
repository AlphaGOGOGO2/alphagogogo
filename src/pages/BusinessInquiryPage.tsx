import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/Footer";
import { Mail, Handshake, Megaphone, Code, Users, Globe, PenTool, FileText } from "lucide-react";
import { SEO } from "@/components/SEO";
export default function BusinessInquiryPage() {
  return <>
      <SEO title="비즈니스 문의 | 알파블로그" description="알파블로그에 비즈니스 제휴 및 협업에 대한 문의를 보내주세요." />
      
      <Navbar />
      
      <main className="min-h-screen bg-gradient-to-b from-white via-purple-50/20 to-purple-50/30">
        {/* 헤더 섹션 */}
        <section className="pt-24 pb-12 md:pt-32 md:pb-16 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 bg-clip-text text-transparent mb-4">
              비즈니스 문의
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              알파블로그와 함께 성장할 수 있는 파트너십과 협업 기회를 찾고 계신가요?<br /> 
              아래 제안 분야를 확인하시고 이메일로 문의해 주시면 빠른 시일 내에 답변 드리겠습니다.
            </p>
          </div>
        </section>
        
        {/* 프로필 섹션 */}
        <section className="pb-12 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-purple-50 via-white to-purple-50/30 rounded-2xl p-8 md:p-12 shadow-lg border border-purple-100/50 mb-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text text-transparent mb-3">
                  프로필
                </h2>
                <p className="text-lg font-medium text-gray-700 mb-2">AI 콘텐츠 크리에이터 & 에듀테이너 & AI 디렉터</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* 주요 활동 */}
                <div className="bg-white/70 rounded-xl p-6 shadow-sm border border-purple-100/30">
                  <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-600 mr-3"></div>
                    주요 활동
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-800">유튜브 채널 '알파GOGOGO' 운영자</p>
                      <p className="text-sm text-gray-600">• 단기간에 구독자 2.6만명 달성</p>
                      <p className="text-sm text-gray-600">• AI 활용법과 실전 노하우를 담은 콘텐츠 제작</p>
                    </div>
                  </div>
                </div>
                
                {/* 전문 분야 */}
                <div className="bg-white/70 rounded-xl p-6 shadow-sm border border-purple-100/30">
                  <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-600 mr-3"></div>
                    전문 분야
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">• AI를 활용한 퍼스널 브랜딩</p>
                    <p className="text-gray-700">• 바이브코딩(Vibe Coding)</p>
                    <p className="text-gray-700">• AI 도구 활용 및 응용 교육</p>
                  </div>
                </div>
                
                {/* 커뮤니티 운영 */}
                <div className="bg-white/70 rounded-xl p-6 shadow-sm border border-purple-100/30">
                  <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-600 mr-3"></div>
                    커뮤니티 운영
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">• 5,000명을 보유한 AI 오픈 커뮤니티 운영</p>
                    <p className="text-gray-700">• AI 정보 공유 및 네트워킹 활성화</p>
                  </div>
                </div>
                
                {/* 강연 활동 */}
                <div className="bg-white/70 rounded-xl p-6 shadow-sm border border-purple-100/30">
                  <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-600 mr-3"></div>
                    강연 활동
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">• 온·오프라인 AI 교육 강연</p>
                    <p className="text-gray-700">• 실무 중심의 AI 활용법 전파</p>
                  </div>
                </div>
              </div>
              
              {/* 핵심 가치 */}
              <div className="mt-8 text-center bg-gradient-to-r from-purple-100/50 to-purple-50/30 rounded-xl p-6 border border-purple-200/30">
                <h3 className="text-lg font-bold text-purple-800 mb-3">핵심 가치</h3>
                <p className="text-gray-700 italic leading-relaxed max-w-3xl mx-auto">
                  "AI를 통해 누구나 자신만의 브랜드를 만들고, 창의적인 결과물을 만들어낼 수 있도록 돕는 것"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 포트폴리오 사이트 */}
        <section className="pb-12 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600">
                포트폴리오 사이트
              </span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Alphademy */}
              <a
                href="https://alphademy.co.kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-purple-100/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100/50">
                  <h3 className="text-xl font-bold text-purple-800 mb-2 group-hover:text-purple-900">Alphademy</h3>
                  <p className="text-gray-600 mb-4">AI 교육 플랫폼</p>
                  <p className="text-sm text-gray-500 mb-4">혁신적인 AI 교육 솔루션을 제공하는 온라인 플랫폼</p>
                  <div className="flex items-center text-purple-600 group-hover:text-purple-800 font-medium">
                    <span>사이트 방문하기</span>
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
                <div className="h-2 bg-gradient-to-r from-purple-400 to-purple-600"></div>
              </a>

              {/* Beauty Life eBook */}
              <a
                href="https://beautylifeebook.kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-purple-100/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="p-6 bg-gradient-to-r from-pink-50 to-purple-50">
                  <h3 className="text-xl font-bold text-purple-800 mb-2 group-hover:text-purple-900">Beauty Life eBook</h3>
                  <p className="text-gray-600 mb-4">뷰티 라이프 전자책</p>
                  <p className="text-sm text-gray-500 mb-4">아름다운 라이프스타일을 위한 디지털 콘텐츠 플랫폼</p>
                  <div className="flex items-center text-purple-600 group-hover:text-purple-800 font-medium">
                    <span>사이트 방문하기</span>
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
                <div className="h-2 bg-gradient-to-r from-pink-400 to-purple-500"></div>
              </a>

              {/* Lucky Rugby */}
              <a
                href="https://luckyrugby.kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-purple-100/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
                  <h3 className="text-xl font-bold text-purple-800 mb-2 group-hover:text-purple-900">Lucky Rugby</h3>
                  <p className="text-gray-600 mb-4">럭키 럭비 플랫폼</p>
                  <p className="text-sm text-gray-500 mb-4">럭비 스포츠 관련 정보와 커뮤니티 서비스</p>
                  <div className="flex items-center text-purple-600 group-hover:text-purple-800 font-medium">
                    <span>사이트 방문하기</span>
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
                <div className="h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>
              </a>

              {/* Hian */}
              <a
                href="https://hian.co.kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-purple-100/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h3 className="text-xl font-bold text-purple-800 mb-2 group-hover:text-purple-900">히안 (HIAN)</h3>
                  <p className="text-gray-600 mb-4">야끼니쿠 전문점</p>
                  <p className="text-sm text-gray-500 mb-4">프리미엄 야끼니쿠를 제공하는 일식 전문 레스토랑</p>
                  <div className="flex items-center text-purple-600 group-hover:text-purple-800 font-medium">
                    <span>사이트 방문하기</span>
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
                <div className="h-2 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
              </a>
            </div>
          </div>
        </section>

        {/* 연락처 정보 */}
        <section className="pb-12 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="glass-card backdrop-blur-lg bg-white/70 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-center gap-6 mb-16 hover:shadow-xl transition-all duration-300 border border-purple-100/50">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-700 shadow-md">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-800 mb-2">이메일 문의</h3>
                <p className="text-lg font-medium bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">skssk01033@naver.com</p>
                <p className="text-gray-500 mt-2">월-금: 10:00 - 18:00 (공휴일 제외)</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* 비즈니스 제안 섹션 */}
        <section className="pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600">
                비즈니스 제안 분야
              </span>
            </h2>
            
            {/* 콘텐츠 제휴 */}
            <div className="mb-10 overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100/50">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 bg-gradient-to-br from-purple-100/80 via-purple-200/50 to-purple-100/70 p-8 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 shadow-md flex items-center justify-center">
                      <Handshake className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-900 to-purple-700 bg-clip-text text-transparent">콘텐츠 제휴</h3>
                  </div>
                  <p className="text-gray-700 mb-4">양질의 콘텐츠를 함께 만들고 공유하여 상호 가치를 높이는 파트너십입니다.</p>
                </div>
                <div className="lg:w-2/3 p-8 bg-white">
                  <div className="grid md:grid-cols-2 gap-6">
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-700 to-purple-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">콘텐츠 교차 게시 및 홍보</h4>
                        <p className="text-gray-600 text-sm">각 플랫폼의 특성을 살린 콘텐츠 공유로 독자층 확장</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-700 to-purple-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">유튜브 플랫폼 제안</h4>
                        <p className="text-gray-600 text-sm">영상 콘텐츠 협업을 통한 시각적 브랜딩 및 영향력 확대</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-700 to-purple-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">콘텐츠 마케팅 전략 협업</h4>
                        <p className="text-gray-600 text-sm">효과적인 콘텐츠 마케팅을 위한 전략적 파트너십</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-700 to-purple-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">AI 관련 협업 웨비나</h4>
                        <p className="text-gray-600 text-sm">최신 AI 트렌드와 활용 방안에 대한 공동 웨비나 개최</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 광고 및 스폰서십 */}
            <div className="mb-10 overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100/50">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 bg-gradient-to-br from-pink-100/80 via-purple-100/50 to-pink-50/70 p-8 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 shadow-md flex items-center justify-center">
                      <Megaphone className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-600 bg-clip-text text-transparent">광고 및 스폰서십</h3>
                  </div>
                  <p className="text-gray-700 mb-4">타겟 오디언스에게 효과적으로 도달하여 브랜드 인지도와 관심을 높입니다.</p>
                </div>
                <div className="lg:w-2/3 p-8 bg-white">
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">배너 및 디스플레이 광고</h4>
                        <p className="text-gray-600 text-sm">AI 및 기술에 관심 있는 타겟 독자층에 효과적인 노출</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">스폰서 콘텐츠 제작</h4>
                        <p className="text-gray-600 text-sm">브랜드 메시지를 담은 고품질 네이티브 콘텐츠 제작</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">뉴스레터 광고 삽입</h4>
                        <p className="text-gray-600 text-sm">주목도 높은 뉴스레터를 통한 효과적인 메시지 전달</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">이벤트 및 웨비나 스폰서십</h4>
                        <p className="text-gray-600 text-sm">온라인 이벤트를 통한 브랜드 인지도 및 신뢰도 향상</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* SEO 웹페이지 개발 */}
            <div className="mb-10 overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100/50">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 bg-gradient-to-br from-blue-100/80 via-indigo-100/50 to-blue-50/70 p-8 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md flex items-center justify-center">
                      <Code className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">SEO 웹페이지 개발</h3>
                  </div>
                  <p className="text-gray-700 mb-4">검색엔진 최적화된 웹사이트로 온라인 가시성을 높이고 비즈니스 성장을 돕습니다.</p>
                </div>
                <div className="lg:w-2/3 p-8 bg-white">
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">사이트 SEO 진단 및 컨설팅</h4>
                        <p className="text-gray-600 text-sm">현재 웹사이트의 SEO 상태 분석 및 개선 방안 제시</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">검색엔진 최적화 개발</h4>
                        <p className="text-gray-600 text-sm">구조적으로 최적화된 웹페이지 설계 및 구현</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">콘텐츠 SEO 전략 수립</h4>
                        <p className="text-gray-600 text-sm">키워드 분석 및 효과적인 콘텐츠 전략 개발</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">기술적 SEO 구현</h4>
                        <p className="text-gray-600 text-sm">사이트맵, 메타데이터, 스키마 마크업 등 기술적 요소 최적화</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 기타 협업 제안 */}
            <div className="mb-16 overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100/50">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 bg-gradient-to-br from-amber-100/80 via-orange-100/50 to-amber-50/70 p-8 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 shadow-md flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">기타 협업 제안</h3>
                  </div>
                  <p className="text-gray-700 mb-4">새로운 아이디어와 창의적인 파트너십으로 함께 성장하는 기회를 만들어보세요.</p>
                </div>
                <div className="lg:w-2/3 p-8 bg-white">
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-400 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">AI 기술 관련 리서치 협업</h4>
                        <p className="text-gray-600 text-sm">AI 기술 발전에 관한 최신 리서치 및 연구 파트너십</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-400 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">멤버십 프로그램 연계</h4>
                        <p className="text-gray-600 text-sm">상호 혜택을 제공하는 멤버십 프로그램 구축</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-400 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">커뮤니티 이벤트 공동 주최</h4>
                        <p className="text-gray-600 text-sm">온/오프라인 커뮤니티 활성화를 위한 공동 이벤트 기획</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-400 mt-2.5"></div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">크리에이티브 프로젝트 제안</h4>
                        <p className="text-gray-600 text-sm">혁신적인 아이디어를 실현하는 창의적 프로젝트 협업</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 협업 프로세스 섹션 */}
            <div className="mb-16">
              <h3 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text text-transparent mb-10 text-center">
                협업 프로세스
              </h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center mx-auto mb-4 shadow-md">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-lg font-medium mb-2 bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text text-transparent">01. 문의</h4>
                  <p className="text-gray-600 text-sm">이메일을 통해 비즈니스 제안 내용과 목표를 공유해 주세요.</p>
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-purple-300 to-purple-100 -z-10"></div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center mx-auto mb-4 shadow-md">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-lg font-medium mb-2 bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text text-transparent">02. 제안 검토</h4>
                  <p className="text-gray-600 text-sm">접수된 제안을 검토하고 가능성을 평가합니다.</p>
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-purple-300 to-purple-100 -z-10"></div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center mx-auto mb-4 shadow-md">
                    <PenTool className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-lg font-medium mb-2 bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text text-transparent">03. 계획 수립</h4>
                  <p className="text-gray-600 text-sm">구체적인 협업 계획과 목표를 함께 설정합니다.</p>
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-purple-300 to-purple-100 -z-10"></div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center mx-auto mb-4 shadow-md">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-lg font-medium mb-2 bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text text-transparent">04. 협업 실행</h4>
                  <p className="text-gray-600 text-sm">합의된 계획에 따라 협업을 진행하고 결과를 측정합니다.</p>
                </div>
              </div>
            </div>
            
            {/* CTA 섹션 */}
            <div className="text-center bg-gradient-to-r from-purple-50 via-purple-100/50 to-purple-50 p-10 md:p-14 rounded-2xl shadow-md">
              <h3 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text text-transparent mb-4">
                성공적인 협업을 기대합니다
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                알파블로그는 항상 새로운 아이디어와 협업에 열려 있습니다. <br />
                여러분의 비즈니스와 함께 성장할 수 있는 기회를 찾고 있습니다.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>;
}