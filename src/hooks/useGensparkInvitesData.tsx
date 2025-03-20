
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { GensparkInvite } from "@/types/genspark";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useGensparkInvitesData(
  setLocalInvites: React.Dispatch<React.SetStateAction<GensparkInvite[]>>
) {
  const [refreshKey, setRefreshKey] = useState(0);

  // 초대 데이터 가져오기
  const fetchInvites = useCallback(async () => {
    console.log("초대 데이터를 가져오는 중...");
    
    try {
      const { data, error } = await supabase
        .from('genspark_invites')
        .select('*')
        .order('clicks', { ascending: false }) // 클릭 수 내림차순으로 정렬 (높은 순서대로)
        .order('created_at', { ascending: false }); // 같은 클릭 수일 경우 최신순으로 정렬
      
      if (error) {
        console.error("초대 가져오기 오류:", error);
        toast.error("초대 링크 목록을 불러오는 중 오류가 발생했습니다");
        throw new Error(error.message);
      }
      
      console.log("가져온 초대 데이터:", data);
      
      if (data) {
        // 클릭 수가 숫자인지 확인
        const formattedData = data.map(invite => ({
          ...invite,
          clicks: typeof invite.clicks === 'number' 
            ? invite.clicks 
            : typeof invite.clicks === 'string' 
              ? parseInt(invite.clicks, 10) 
              : 0
        })) as GensparkInvite[];
        
        console.log("변환된 초대 데이터:", formattedData);
        setLocalInvites(formattedData);
        return formattedData;
      }
      
      return [] as GensparkInvite[];
    } catch (err) {
      console.error("초대 가져오기 예외:", err);
      toast.error("초대 링크 목록을 불러오는 중 오류가 발생했습니다");
      throw err;
    }
  }, [setLocalInvites]);

  const queryResult = useQuery({
    queryKey: ['genspark-invites', refreshKey],
    queryFn: fetchInvites,
    staleTime: 0, // 항상 새로운 데이터 가져오기
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 30000, // 30초마다 리프레시
  });

  // 수동 리프레시 처리
  const handleDataRefresh = useCallback(() => {
    console.log("수동 리프레시 요청됨");
    setRefreshKey(prev => prev + 1);
  }, []);

  return {
    ...queryResult,
    handleDataRefresh
  };
}
