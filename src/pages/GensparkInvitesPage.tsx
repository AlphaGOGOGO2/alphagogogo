
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/Footer";
import { InviteForm } from "@/components/genspark/InviteForm";
import { InviteGrid } from "@/components/genspark/InviteGrid";
import { GensparkInvite } from "@/types/genspark";
import { supabase } from "@/integrations/supabase/client";

export default function GensparkInvitesPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: invites = [], isLoading, error } = useQuery({
    queryKey: ['genspark-invites', refreshKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('genspark_invites')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as GensparkInvite[];
    }
  });

  const handleDataRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

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
            AI 품앗이
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            젠스파크 초대 링크를 공유하고 다른 사람들의 초대 링크를 이용해보세요. 
            서로 도우며 AI 생태계를 함께 키워나가요!
          </p>
        </div>

        <section className="mb-16 max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-purple-800">초대 링크 등록하기</h2>
            <InviteForm onSuccess={handleDataRefresh} />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-purple-800">등록된 초대 링크</h2>
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-500">초대 링크를 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-lg text-red-500">초대 링크를 불러오는 중 오류가 발생했습니다.</p>
            </div>
          ) : (
            <InviteGrid invites={invites} onInviteUpdate={handleDataRefresh} />
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
