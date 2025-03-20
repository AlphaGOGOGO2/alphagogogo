
import React, { useState, useEffect } from "react";
import { GensparkInvite } from "@/types/genspark";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getClientId } from "@/utils/clientIdUtils";

interface InviteCardProps {
  invite: GensparkInvite;
  onUpdateClick?: (updatedInvite: Partial<GensparkInvite>) => void;
}

export function InviteCard({ invite, onUpdateClick }: InviteCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  
  // 초기 로드 및 invite 변경 시 클릭 카운트 설정
  useEffect(() => {
    const fetchCurrentInvite = async () => {
      try {
        const { data, error } = await supabase
          .from('genspark_invites')
          .select('clicks')
          .eq('id', invite.id)
          .single();
        
        if (error) {
          console.error("Error fetching current invite:", error);
          return;
        }
        
        if (data && typeof data.clicks === 'number') {
          setClickCount(data.clicks);
        } else {
          setClickCount(invite.clicks || 0);
        }
      } catch (error) {
        console.error("Error in fetchCurrentInvite:", error);
        setClickCount(invite.clicks || 0);
      }
    };
    
    fetchCurrentInvite();
  }, [invite.id, invite.clicks]);
  
  // 실시간 업데이트 구독
  useEffect(() => {
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
            setClickCount(payload.new.clicks);
            
            // 부모 컴포넌트에 업데이트 알림 (선택적)
            if (onUpdateClick && typeof onUpdateClick === 'function') {
              onUpdateClick({
                id: invite.id,
                clicks: payload.new.clicks
              });
            }
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [invite.id, onUpdateClick]);
  
  const handleInviteClick = async () => {
    try {
      // 이미 최대 클릭 수에 도달했으면 중단
      if (clickCount >= 30) {
        window.open(invite.invite_url, '_blank');
        return;
      }
      
      setIsLoading(true);
      const clientId = getClientId();
      
      // 최신 데이터 가져오기
      const { data: currentInvite, error: fetchError } = await supabase
        .from('genspark_invites')
        .select('clicks')
        .eq('id', invite.id)
        .single();
      
      if (fetchError) {
        console.error("Error fetching current invite clicks:", fetchError);
        setIsLoading(false);
        window.open(invite.invite_url, '_blank');
        return;
      }
      
      // 현재 DB 값 기준으로 계산
      const currentClicks = currentInvite?.clicks || 0;
      const newClickCount = currentClicks + 1;
      
      // 임시로 로컬 상태 업데이트 (UI 반응성)
      setClickCount(newClickCount);
      
      // DB 업데이트
      const { error: updateError } = await supabase
        .from('genspark_invites')
        .update({ clicks: newClickCount })
        .eq('id', invite.id);
      
      if (updateError) {
        console.error("Error updating click count:", updateError);
        // 에러 발생 시 원래 값으로 되돌리기
        setClickCount(currentClicks);
      } else if (onUpdateClick && typeof onUpdateClick === 'function') {
        // 부모 컴포넌트에 알림
        onUpdateClick({
          id: invite.id,
          clicks: newClickCount
        });
      }
      
      // URL 열기
      window.open(invite.invite_url, '_blank');
    } catch (error) {
      console.error("Error in handleInviteClick:", error);
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
