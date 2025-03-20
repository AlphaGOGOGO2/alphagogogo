
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/Footer";
import { InfoCards } from "@/components/genspark/InfoCards";
import { InviteFormSection } from "@/components/genspark/InviteFormSection";
import { InviteGrid } from "@/components/genspark/InviteGrid";
import { useGensparkInvites } from "@/hooks/useGensparkInvites";

export default function GensparkInvitesPage() {
  const { 
    invites, 
    isLoading, 
    error, 
    handleDataRefresh, 
    handleUpdateInvite 
  } = useGensparkInvites();
  
  return (
    <>
      <Helmet>
        <title>AI 품앗이 - 젠스파크 초대 링크 공유 | 알파블로그</title>
        <meta name="description" content="젠스파크 초대 링크를 공유하고 다른 사람들의 초대 링크를 확인하세요." />
      </Helmet>

      <Navbar />

      <main className="pt-24 px-4 pb-16 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4">
            젠스파크 친구 초대하고 무료로 이용하기!
          </h1>
          <p className="font-medium text-purple-800 text-lg mb-8">
            AI 품앗이: 서로 도우며 AI 생태계를 함께 키워나가요!
          </p>
          
          <InfoCards />
        </div>

        <InviteFormSection onSuccess={handleDataRefresh} />

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-purple-800">등록된 초대 링크</h2>
          <InviteGrid 
            invites={invites} 
            isLoading={isLoading} 
            error={error} 
            onUpdateClick={handleUpdateInvite} 
          />
        </section>
      </main>

      <Footer />
    </>
  );
}
