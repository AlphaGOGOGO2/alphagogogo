
import { useState } from "react";
import { Send, CheckCircle, Sparkles } from "lucide-react";

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
      {/* Enhanced background design elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-violet-200 to-indigo-200 blur-3xl opacity-60"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-purple-200 to-fuchsia-100 blur-3xl opacity-60"></div>
      
      <div className="relative max-w-5xl mx-auto px-6 md:px-8">
        <div className="gradient-border rounded-2xl overflow-hidden purple-glow">
          <div className="bg-white/90 backdrop-blur-md p-8 md:p-12 lg:p-16 bg-gradient-to-br from-white to-purple-50/50">
            <div className="text-center max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-6 text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full shadow-lg">
                <Sparkles size={14} className="animate-pulse" />
                블로그 업데이트 받기
              </span>
              
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-purple-800">
                알파블로그 소식을 받아보세요
              </h2>
              
              <p className="text-gray-600 mb-8 text-balance">
                새로운 글이 업로드되면 가장 먼저 알려드립니다. 인공지능 세계의 최신 소식을 놓치지 마세요.
              </p>
              
              {isSubmitted ? (
                <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg animate-fade-in shadow-lg border border-green-100">
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
                      className="w-full px-4 py-3.5 pl-5 pr-14 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all shadow-md"
                      required
                    />
                    <button 
                      type="submit" 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-2 rounded-lg hover:shadow-lg hover:shadow-purple-300/50 transition-all"
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
