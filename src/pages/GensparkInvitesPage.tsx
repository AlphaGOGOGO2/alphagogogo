
import { useEffect } from "react";
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
  
  // 페이지 마운트 및 이동 시 데이터 리프레시
  useEffect(() => {
    console.log("GensparkInvitesPage 마운트됨 - 데이터 리프레시 중");
    // 마운트 시 즉시 리프레시
    handleDataRefresh();
    
    // 정기적인 데이터 갱신 설정
    const intervalId = setInterval(() => {
      console.log("정기적인 리프레시 트리거됨");
      handleDataRefresh();
    }, 30000); // 30초마다 리프레시
    
    return () => {
      clearInterval(intervalId);
    };
  }, [handleDataRefresh]);
  
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
            <span className="text-xl md:text-2xl font-semibold">72만원</span> 상당의 헤택을 무료로 이용할 수 있는 기회! 놓치지 마세요!
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
