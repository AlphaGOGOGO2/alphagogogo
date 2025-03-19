
import { useState } from "react";
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
            젠스파크 친구 초대하고 무료로 이용하기!
          </h1>
          <div className="text-lg text-gray-600 max-w-3xl mx-auto space-y-6">
            <p className="font-medium text-purple-800">
              AI 품앗이: 서로 도우며 AI 생태계를 함께 키워나가요!
            </p>
            
            <div className="bg-purple-50 p-5 rounded-lg border border-purple-200 text-left">
              <h3 className="font-semibold text-purple-900 mb-3">적격 규칙:</h3>
              <ul className="list-disc pl-5 space-y-2 text-purple-800">
                <li>초대된 친구는 2024년 12월 1일 이후에 등록한 신규 사용자여야 합니다.</li>
                <li>각 사용자는 초대를 통해 최대 20개월의 무료 Genspark Plus를 받을 수 있습니다.</li>
                <li>조회수와 가입자수는 비례하지 않습니다.</li>
                <li>해당 이벤트는 3월 31일까지 진행됩니다.</li>
              </ul>
            </div>
          </div>
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
