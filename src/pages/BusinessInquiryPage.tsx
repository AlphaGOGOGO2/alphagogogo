
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/Footer";
import { Mail, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";

export default function BusinessInquiryPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 실제로는 이메일 전송 로직이 들어갈 곳입니다
    // 현재는 목업으로 처리합니다
    setTimeout(() => {
      toast.success("문의가 성공적으로 전송되었습니다", {
        description: "빠른 시일 내에 답변드리겠습니다.",
        position: "top-center"
      });
      
      // 폼 초기화
      setName("");
      setEmail("");
      setCompany("");
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
    }, 1500);
  };
  
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
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-900 mb-4">
              비즈니스 문의
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              알파블로그와 함께 성장할 수 있는 파트너십과 협업 기회를 찾고 계신가요? 
              아래 양식을 통해 문의해 주시면 빠른 시일 내에 답변 드리겠습니다.
            </p>
          </div>
        </section>
        
        {/* 문의 양식 섹션 */}
        <section className="pb-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="grid md:grid-cols-5">
                {/* 문의 안내 사이드바 */}
                <div className="md:col-span-2 bg-gradient-to-br from-purple-600 to-purple-800 text-white p-8">
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-6">연락처 정보</h3>
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <Mail className="mr-3 mt-1 flex-shrink-0" />
                          <span>skssk01033@naver.com</span>
                        </li>
                        <li className="mt-8">
                          <p className="font-medium text-lg">근무 시간</p>
                          <p className="text-white/80">월-금: 10:00 - 18:00</p>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="mt-12">
                      <h4 className="font-medium text-lg mb-3">문의 분야</h4>
                      <ul className="space-y-2 text-white/80">
                        <li>• 콘텐츠 제휴</li>
                        <li>• 광고 및 스폰서십</li>
                        <li>• 시스템 개발 문의</li>
                        <li>• 기타 협업 제안</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* 문의 양식 */}
                <div className="md:col-span-3 p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    문의 양식 작성
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700 block">
                          이름 <span className="text-red-500">*</span>
                        </label>
                        <Input 
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="이름을 입력해주세요"
                          required
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                          이메일 <span className="text-red-500">*</span>
                        </label>
                        <Input 
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="이메일을 입력해주세요"
                          required
                          className="w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-medium text-gray-700 block">
                        회사/기관명
                      </label>
                      <Input 
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="회사 또는 기관명을 입력해주세요"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-gray-700 block">
                        제목 <span className="text-red-500">*</span>
                      </label>
                      <Input 
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="문의 제목을 입력해주세요"
                        required
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-gray-700 block">
                        문의 내용 <span className="text-red-500">*</span>
                      </label>
                      <Textarea 
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="문의하실 내용을 자세히 입력해주세요"
                        required
                        className="min-h-[150px] w-full"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-purple-700 hover:bg-purple-800 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          처리 중 <Check className="ml-2 h-4 w-4 animate-spin" />
                        </span>
                      ) : (
                        <span className="flex items-center">
                          문의하기 <Send className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
            
            {/* 추가 정보 */}
            <div className="mt-16 text-center">
              <h3 className="text-xl font-semibold text-purple-800 mb-3">
                성공적인 협업을 기대합니다
              </h3>
              <p className="text-gray-600">
                알파블로그는 항상 새로운 아이디어와 협업에 열려 있습니다. <br />
                여러분의 비즈니스와 함께 성장할 수 있는 기회를 찾고 있습니다.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
