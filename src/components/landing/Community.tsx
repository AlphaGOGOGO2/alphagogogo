import { Link } from "react-router-dom";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Community() {
  return (
    <section id="community" className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            커뮤니티
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI에 대한 궁금증을 함께 나누고, 비즈니스 문의도 환영합니다
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* 오픈 채팅방 */}
          <Link
            to="/open-chat-rooms"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <MessageSquare className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                오픈 채팅방
              </h3>
              <p className="text-gray-600 mb-6">
                AI에 관심 있는 분들과 실시간으로 소통하고 정보를 공유하세요
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700">
                채팅방 입장하기
              </Button>
            </div>
          </Link>

          {/* 비즈니스 문의 */}
          <Link
            to="/business-inquiry"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-pink-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors">
                <Send className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                비즈니스 문의
              </h3>
              <p className="text-gray-600 mb-6">
                협업 제안, 광고 문의 등 비즈니스 관련 문의를 남겨주세요
              </p>
              <Button className="bg-pink-600 hover:bg-pink-700">
                문의하기
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
