
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CommunityChat } from "@/components/community/CommunityChat";

export default function CommunityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-12"> {/* 상단 패딩 유지하고 하단 패딩 추가 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">커뮤니티 채팅</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI에 관심 있는 사람들과 실시간으로 대화하고 정보를 공유하세요.
            </p>
          </div>
          
          <CommunityChat />
        </div>
      </main>
      <Footer />
    </div>
  );
}
