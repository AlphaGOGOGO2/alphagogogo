
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { GensparkInvite } from "@/types/genspark";
import { supabase } from "@/integrations/supabase/client";

export function useGensparkInvites() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [localInvites, setLocalInvites] = useState<GensparkInvite[]>([]);

  // 실시간 업데이트 구독
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

  return {
    invites: displayInvites,
    isLoading,
    error,
    handleDataRefresh,
    handleUpdateInvite
  };
}
