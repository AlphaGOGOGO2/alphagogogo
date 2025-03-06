
import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Simulated subscription success
      setTimeout(() => {
        setIsSubmitted(true);
        setEmail("");
      }, 800);
    }
  };
  
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-purple-100 blur-3xl opacity-60"></div>
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-purple-200 blur-3xl opacity-60"></div>
      
      <div className="relative max-w-5xl mx-auto px-6 md:px-8">
        <div className="gradient-border rounded-2xl overflow-hidden">
          <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 lg:p-16">
            <div className="text-center max-w-2xl mx-auto">
              <span className="inline-block px-3 py-1 mb-6 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
                최신 정보 받기
              </span>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                AI 인사이트를 받아보세요
              </h2>
              
              <p className="text-gray-600 mb-8 text-balance">
                가장 중요한 AI 개발, 분석 및 독점 콘텐츠에 대한 주간 업데이트를 위해 뉴스레터를 구독하세요.
              </p>
              
              {isSubmitted ? (
                <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg animate-fade-in">
                  <CheckCircle size={20} />
                  <span className="font-medium">구독해 주셔서 감사합니다!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="이메일 주소 입력"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 pl-5 pr-14 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      required
                    />
                    <button 
                      type="submit" 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
                      aria-label="구독하기"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-gray-500">
                    개인정보를 존중합니다. 언제든지 구독 취소 가능합니다.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
