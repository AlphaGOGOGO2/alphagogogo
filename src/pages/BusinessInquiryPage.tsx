import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowUp, Check, ExternalLink, Mail, MessageCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function BusinessInquiryPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 md:pt-28">
        <section className="bg-gray-50/50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text text-transparent mb-6">
                비즈니스 문의
              </h1>
              <p className="text-gray-600 text-lg md:text-xl mb-10">
                알파블로그와 함께 성장할 수 있는 파트너십을 원하시나요? <br />
                다양한 비즈니스 협력 기회에 대해 문의해주세요.
              </p>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 bg-white p-6 rounded-lg shadow-sm">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">이메일 문의</h3>
                  <p className="text-lg font-medium bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">skssk01033@naver.com</p>
                  <p className="text-gray-500 mt-2">월-금: 10:00 - 18:00 (공휴일 제외)</p>
                </div>
                <div className="md:ml-auto">
                  <Button
                    onClick={() => window.location.href = 'mailto:skssk01033@naver.com?subject=[비즈니스 문의]'}
                    className="bg-gradient-to-r from-purple-700 to-purple-600 hover:opacity-90 transition-all shadow-md hover:shadow-purple-300/30"
                  >
                    메일 보내기 <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                FAQ
              </h2>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="general" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
                    일반 문의
                  </TabsTrigger>
                  <TabsTrigger value="partnership" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
                    파트너십 문의
                  </TabsTrigger>
                  <TabsTrigger value="technical" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
                    기술 문의
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-4">
                  <Card className="shadow-sm">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        일반 문의는 어떻게 하나요?
                      </h3>
                      <p className="text-gray-600">
                        이메일 또는 문의 양식을 통해 일반 문의를 하실 수 있습니다.
                      </p>
                    </div>
                  </Card>
                  <Card className="shadow-sm">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        답변은 언제 받을 수 있나요?
                      </h3>
                      <p className="text-gray-600">
                        최대한 빠르게 답변드리려고 노력하고 있으며, 일반적으로 1~2일 내에 답변을 받으실 수 있습니다.
                      </p>
                    </div>
                  </Card>
                </TabsContent>
                <TabsContent value="partnership" className="space-y-4">
                  <Card className="shadow-sm">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        파트너십 제안은 어떻게 해야 하나요?
                      </h3>
                      <p className="text-gray-600">
                        파트너십 제안은 상세한 제안 내용과 함께 이메일로 보내주시면 검토 후 연락드리겠습니다.
                      </p>
                    </div>
                  </Card>
                  <Card className="shadow-sm">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        어떤 종류의 파트너십을 찾고 있나요?
                      </h3>
                      <p className="text-gray-600">
                        알파블로그는 콘텐츠 협력, 기술 제휴, 마케팅 협력 등 다양한 형태의 파트너십을 고려하고 있습니다.
                      </p>
                    </div>
                  </Card>
                </TabsContent>
                <TabsContent value="technical" className="space-y-4">
                  <Card className="shadow-sm">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        기술적인 문제 발생 시 어떻게 해야 하나요?
                      </h3>
                      <p className="text-gray-600">
                        기술적인 문제는 상세한 오류 내용과 함께 이메일로 보내주시면 신속하게 해결해 드리겠습니다.
                      </p>
                    </div>
                  </Card>
                  <Card className="shadow-sm">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        기술 지원은 어떤 방식으로 제공되나요?
                      </h3>
                      <p className="text-gray-600">
                        기술 지원은 이메일을 통해 제공되며, 필요시 원격 지원을 제공할 수 있습니다.
                      </p>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-24 bg-gray-50/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                알파블로그 서비스 정보
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="shadow-sm">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      AI 기반 블로그 글쓰기
                    </h3>
                    <p className="text-gray-600 mb-4">
                      알파블로그의 AI 기술로 쉽고 빠르게 고품질의 블로그 글을 작성하세요.
                    </p>
                    <div className="flex items-center gap-2 text-purple-600">
                      <Check className="h-4 w-4" />
                      <span>자동 글 생성</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600">
                      <Check className="h-4 w-4" />
                      <span>SEO 최적화</span>
                    </div>
                  </div>
                </Card>
                <Card className="shadow-sm">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      커뮤니티 기능
                    </h3>
                    <p className="text-gray-600 mb-4">
                      알파블로그 커뮤니티에서 다양한 사람들과 소통하고 지식을 공유하세요.
                    </p>
                    <div className="flex items-center gap-2 text-purple-600">
                      <MessageCircle className="h-4 w-4" />
                      <span>실시간 채팅</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600">
                      <MessageCircle className="h-4 w-4" />
                      <span>그룹 활동</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        <section className="bg-purple-800 py-16 md:py-24 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">함께 성장해요</h2>
              <p className="text-lg md:text-xl mb-10 text-purple-100">
                알파블로그는 항상 새로운 아이디어와 협업에 열려 있습니다. <br />
                여러분의 비즈니스와 함께 성장할 수 있는 기회를 찾고 있습니다.
              </p>
              <Button 
                onClick={() => window.location.href = 'mailto:skssk01033@naver.com?subject=[비즈니스 제안]'} 
                className="bg-gradient-to-r from-purple-700 to-purple-500 hover:opacity-90 shadow-lg hover:shadow-purple-300/30 transition-all px-8 py-6 text-lg"
              >
                지금 문의하기 <Mail className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
        
        {showScrollButton && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-purple-600 text-white rounded-full p-3 shadow-lg hover:bg-purple-700 transition-colors duration-300"
            aria-label="맨 위로 스크롤"
          >
            <ArrowUp className="h-6 w-6" />
          </button>
        )}
      </main>
      <Footer />
    </div>
  );
}
