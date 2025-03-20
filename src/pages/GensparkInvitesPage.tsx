
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/Footer";
import { InviteForm } from "@/components/genspark/InviteForm";
import { InviteGrid } from "@/components/genspark/InviteGrid";
import { GensparkInvite } from "@/types/genspark";
import { supabase } from "@/integrations/supabase/client";
import { Info, Shield, Users, Heart } from "lucide-react";

export default function GensparkInvitesPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [localInvites, setLocalInvites] = useState<GensparkInvite[]>([]);

  // 모든 초대에 대한 실시간 변경 구독
  useEffect(() => {
    console.log("실시간 업데이트 구독 설정 중...");
    
    // genspark_invites 테이블의 모든 변경 사항을 수신하는 채널 생성
    const channel = supabase
      .channel('genspark_invites_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // 모든 이벤트(INSERT, UPDATE, DELETE) 수신
          schema: 'public',
          table: 'genspark_invites'
        },
        (payload) => {
          console.log("수파베이스 테이블 변경 감지:", payload);
          // 변경 사항이 있을 때 새로고침 트리거
          setRefreshKey(prev => prev + 1);
          
          // 로컬 상태도 업데이트
          if (payload.eventType === 'UPDATE' && payload.new) {
            setLocalInvites(prev => 
              prev.map(invite => 
                invite.id === payload.new.id 
                  ? { ...invite, ...payload.new } 
                  : invite
              )
            );
          } else if (payload.eventType === 'INSERT' && payload.new) {
            setLocalInvites(prev => [payload.new as GensparkInvite, ...prev]);
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setLocalInvites(prev => 
              prev.filter(invite => invite.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log(`genspark_invites 테이블에 대한 실시간 구독 상태: ${status}`);
      });

    // 컴포넌트 언마운트 시 구독 정리
    return () => {
      console.log("실시간 업데이트 구독 정리 중...");
      supabase.removeChannel(channel);
    };
  }, []);

  const { data: invites = [], isLoading, error } = useQuery({
    queryKey: ['genspark-invites', refreshKey],
    queryFn: async () => {
      console.log("초대 데이터 가져오는 중...");
      const { data, error } = await supabase
        .from('genspark_invites')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("초대 가져오기 오류:", error);
        throw new Error(error.message);
      }
      
      console.log("가져온 초대:", data);
      
      // 가져온 데이터로 로컬 상태 업데이트
      if (data) {
        setLocalInvites(data as GensparkInvite[]);
      }
      
      return data as GensparkInvite[];
    },
    // 항상 최신 데이터를 가져오도록 staleTime 설정
    staleTime: 0,
    // 사용자가 페이지로 돌아오거나 브라우저 포커스가 변경될 때 자동으로 데이터 새로고침
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const handleDataRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleUpdateInvite = (updatedInvite: Partial<GensparkInvite>) => {
    setLocalInvites(prev => 
      prev.map(invite => 
        invite.id === updatedInvite.id 
          ? { ...invite, ...updatedInvite } 
          : invite
      )
    );
  };

  // 실제 표시할 초대 데이터 결정 (로컬 상태 우선, 쿼리 데이터는 백업)
  const displayInvites = localInvites.length > 0 ? localInvites : invites;

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-7 rounded-xl border border-purple-400 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center mb-4">
                <div className="bg-white/20 p-2 rounded-full mr-3">
                  <Info className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-bold text-white text-xl">적격 규칙</h3>
              </div>
              <ul className="text-left space-y-2.5 text-white text-sm md:text-base pl-4">
                <li>초대된 친구는 2024년 12월 1일 이후에 등록한 신규 사용자여야 합니다.</li>
                <li>각 사용자는 초대를 통해 최대 20개월의 Plus 플랜 혜택을 받을 수 있습니다.</li>
                <li>클릭수와 가입자수는 비례하지 않습니다.</li>
                <li className="text-yellow-300 font-semibold">해당 이벤트는 3월 31일까지 진행됩니다.</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] p-7 rounded-xl border border-purple-400 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center mb-4">
                <div className="bg-white/20 p-2 rounded-full mr-3">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-bold text-white text-xl">등록 규칙</h3>
              </div>
              <ul className="text-left space-y-2.5 text-white text-sm md:text-base pl-4">
                <li>중복된 초대 링크는 등록할 수 없습니다.</li>
                <li>젠스파크 초대 링크만 등록 가능합니다.</li>
                <li>닉네임과 한마디로 관심을 끌어보세요!</li>
                <li className="text-yellow-300 font-semibold text-[#FFD700]">클릭수가 30이 되면 삭제됩니다. 서로 견제하세요!</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-[#9B87F5] to-[#7E69AB] p-7 rounded-xl border border-purple-400 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center mb-4">
                <div className="bg-white/20 p-2 rounded-full mr-3">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-bold text-white text-xl">이용 방법</h3>
              </div>
              <ul className="text-left space-y-2.5 text-white text-sm md:text-base pl-4">
                <li>초대 링크를 클릭하여 젠스파크에 가입하세요.</li>
                <li>친구를 초대하여 무료 이용 기간을 늘려보세요.</li>
                <li>자신의 초대 링크를 등록하고 공유하세요.</li>
                <li>다른 사람의 링크도 클릭해주면 서로 도움이 됩니다.</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-[#D946EF] to-[#9333EA] p-7 rounded-xl border border-purple-400 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center mb-4">
                <div className="bg-white/20 p-2 rounded-full mr-3">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-bold text-white text-xl">이용 안내</h3>
              </div>
              <ul className="text-left space-y-2.5 text-white text-sm md:text-base pl-4">
                <li>재미로 만들고 편하게 올려두고 하실일 하시라고 만든겁니다.</li>
                <li>너무 민감하게 반응하지 마세요!</li>
                <li>모두가 함께 혜택을 나누는 공간입니다.</li>
                <li>서로 배려하며 이용해주세요.</li>
              </ul>
            </div>
          </div>
        </div>

        <section className="mb-16 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md border border-purple-200 hover:border-purple-300 transition-all">
            <h2 className="text-2xl font-semibold mb-6 text-purple-800">초대 링크 등록하기</h2>
            <InviteForm onSuccess={handleDataRefresh} />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-purple-800">등록된 초대 링크</h2>
          {isLoading && displayInvites.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-500">초대 링크를 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-lg text-red-500">초대 링크를 불러오는 중 오류가 발생했습니다.</p>
            </div>
          ) : (
            <InviteGrid 
              invites={displayInvites} 
              onUpdateInvite={handleUpdateInvite}
            />
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
