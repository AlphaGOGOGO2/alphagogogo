
import React, { useState, useEffect } from "react";
import { GensparkInvite } from "@/types/genspark";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getClientId } from "@/utils/clientIdUtils";

interface InviteCardProps {
  invite: GensparkInvite;
}

export function InviteCard({ invite }: InviteCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [clickCount, setClickCount] = useState(invite.clicks);

  // 초기화 및 invite prop이 변경될 때 clickCount 업데이트
  useEffect(() => {
    setClickCount(invite.clicks);
  }, [invite.clicks]);

  // 이 특정 초대에 대한 실시간 업데이트 구독
  useEffect(() => {
    // 이 특정 초대에 대한 변경 사항을 수신하는 채널 생성
    const channel = supabase
      .channel(`invite-${invite.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'genspark_invites',
          filter: `id=eq.${invite.id}`
        },
        (payload) => {
          if (payload.new && typeof payload.new.clicks === 'number') {
            console.log(`실시간 업데이트: ${invite.id}의 클릭 수가 ${payload.new.clicks}로 변경됨`);
            setClickCount(payload.new.clicks);
          }
        }
      )
      .subscribe((status) => {
        console.log(`초대 ${invite.id}에 대한 실시간 구독 상태: ${status}`);
      });

    // 컴포넌트 언마운트 시 구독 정리
    return () => {
      supabase.removeChannel(channel);
    };
  }, [invite.id]);

  const handleInviteClick = async () => {
    if (isLoading || clickCount >= 30) return;
    
    try {
      setIsLoading(true);
      const clientId = getClientId();
      
      console.log(`클릭 처리 시작: 초대 ID ${invite.id}, 현재 클릭 수 ${clickCount}`);
      
      // 최신 초대 데이터 먼저 가져오기
      const { data: currentInvite, error: fetchError } = await supabase
        .from('genspark_invites')
        .select('clicks')
        .eq('id', invite.id)
        .single();
      
      if (fetchError) {
        console.error("초대 데이터 가져오기 오류:", fetchError);
        throw fetchError;
      }
      
      console.log(`현재 DB의 클릭 수: ${currentInvite?.clicks}`);
      
      // 최신 데이터를 기반으로 새 클릭 수 계산
      const newClickCount = (currentInvite?.clicks || 0) + 1;
      
      if (newClickCount > 30) {
        console.log("최대 클릭 수(30)에 도달했습니다.");
        setIsLoading(false);
        return;
      }
      
      // 즉각적인 피드백을 위해 지역 상태 먼저 업데이트
      setClickCount(newClickCount);
      
      // Supabase에서 클릭 수 업데이트
      const { error } = await supabase
        .from('genspark_invites')
        .update({ clicks: newClickCount })
        .eq('id', invite.id);
        
      console.log(`클릭 수 업데이트 요청 완료, 새 값: ${newClickCount}`);

      if (error) {
        // 오류가 있으면 지역 상태 되돌리기
        console.error("클릭 수 업데이트 오류:", error);
        setClickCount(currentInvite?.clicks || 0);
        throw error;
      }
      
      // 초대 URL을 새 탭에서 열기
      window.open(invite.invite_url, '_blank');
    } catch (error) {
      console.error("클릭 수 업데이트 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border-purple-200 hover:border-purple-300">
      <CardHeader className="p-4 pb-2 bg-purple-100">
        <CardTitle className="text-lg font-medium truncate text-purple-900">
          {invite.nickname}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 bg-purple-50">
        <p className="text-sm text-purple-800 mb-2 h-10 overflow-hidden">
          {invite.message}
        </p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
            클릭: {clickCount}/30
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2 bg-purple-50">
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          onClick={handleInviteClick}
          disabled={isLoading || clickCount >= 30}
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          {isLoading ? "처리 중..." : "바로 가기"}
        </Button>
      </CardFooter>
    </Card>
  );
}
