/**
 * 블로그 AI 홍보 배너 컴포넌트
 * alphablogogo.com으로 연결
 */

import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BlogAIBanner() {
  return (
    <section className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* 왼쪽: 텍스트 콘텐츠 */}
          <div className="flex-1 text-white space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
              <span className="text-yellow-300 font-semibold text-sm uppercase tracking-wider">
                AI 블로그 자동화
              </span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
              알파블로그 AI로<br />
              블로그 글쓰기를 자동화하세요
            </h2>

            <p className="text-lg text-purple-100 max-w-xl">
              ChatGPT, Claude, Gemini 3대 AI 모델이 여러분의 블로그 콘텐츠를 자동으로 작성합니다.
              시간은 절약하고, 품질은 높이세요.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                className="bg-white text-purple-700 hover:bg-purple-50 font-semibold group"
                asChild
              >
                <a
                  href="https://www.alphablogogo.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  지금 무료 체험하기
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10"
                asChild
              >
                <a
                  href="https://www.alphablogogo.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  자세히 알아보기
                </a>
              </Button>
            </div>
          </div>

          {/* 오른쪽: 특징 카드 */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: "🤖",
                  title: "3대 AI 모델",
                  description: "GPT-4, Claude, Gemini"
                },
                {
                  icon: "⚡",
                  title: "초고속 생성",
                  description: "30초 만에 완성"
                },
                {
                  icon: "✨",
                  title: "SEO 최적화",
                  description: "검색 노출 자동 최적화"
                },
                {
                  icon: "📊",
                  title: "대량 생성",
                  description: "한 번에 100개까지"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-colors"
                >
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <h3 className="text-white font-semibold text-lg mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-purple-100 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
