
import { useState } from "react";
import { GensparkInvite } from "@/types/genspark";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getClientId } from "@/utils/clientIdUtils";

interface InviteGridProps {
  invites: GensparkInvite[];
  onInviteUpdate: () => void;
}

export function InviteGrid({ invites, onInviteUpdate }: InviteGridProps) {
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [localClickCounts, setLocalClickCounts] = useState<Record<string, number>>({});

  const handleInviteClick = async (invite: GensparkInvite) => {
    if (processingIds.has(invite.id)) return;
    
    try {
      setProcessingIds(prev => new Set([...prev, invite.id]));
      const clientId = getClientId();
      
      // 로컬 상태 즉시 업데이트 (UI 즉시 반영)
      const newClickCount = invite.clicks + 1;
      setLocalClickCounts(prev => ({
        ...prev,
        [invite.id]: newClickCount
      }));
      
      // 클릭 기록 추가
      const { error: clickError } = await supabase
        .from('genspark_invite_clicks')
        .insert({
          invite_id: invite.id,
          client_id: clientId
        });
      
      if (clickError) {
        console.error("Error inserting click:", clickError);
        if (clickError.code === '23505') {
          toast.error("이미 클릭한 링크입니다.");
          // 중복 클릭이면 로컬 상태를 원래대로 되돌림
          setLocalClickCounts(prev => ({
            ...prev,
            [invite.id]: invite.clicks
          }));
          setProcessingIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(invite.id);
            return newSet;
          });
          return;
        }
        throw clickError;
      }
      
      // 초대장 클릭 수 증가
      const { error: updateError } = await supabase
        .from('genspark_invites')
        .update({ clicks: newClickCount })
        .eq('id', invite.id);
      
      if (updateError) {
        console.error("Error updating click count:", updateError);
        // 업데이트 실패 시 로컬 상태를 원래대로 되돌림
        setLocalClickCounts(prev => ({
          ...prev,
          [invite.id]: invite.clicks
        }));
        throw updateError;
      }
      
      // 클릭 수가 10에 도달하면 삭제
      if (newClickCount >= 10) {
        const { error: deleteError } = await supabase
          .from('genspark_invites')
          .delete()
          .eq('id', invite.id);
        
        if (deleteError) {
          console.error("Error deleting invite:", deleteError);
          throw deleteError;
        }
        
        // 삭제 후 데이터 갱신 알림
        toast.success("10회 클릭 달성! 초대장이 삭제되었습니다.");
      }
      
      // 클릭 이벤트 후 데이터 갱신
      onInviteUpdate();
      
      // 실제 링크로 이동
      window.open(invite.invite_url, '_blank');
    } catch (error) {
      console.error("Error handling invite click:", error);
      toast.error("링크 처리 중 오류가 발생했습니다.");
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(invite.id);
        return newSet;
      });
    }
  };

  if (invites.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-500">등록된 초대 링크가 없습니다.</p>
        <p className="text-sm text-gray-400 mt-2">첫 번째 초대 링크를 공유해 보세요!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {invites.map((invite) => {
        // 로컬에 저장된 클릭 수가 있으면 그것을 사용, 없으면 원래 클릭 수를 사용
        const displayedClicks = localClickCounts[invite.id] !== undefined 
          ? localClickCounts[invite.id] 
          : invite.clicks;

        return (
          <Card 
            key={invite.id} 
            className="overflow-hidden hover:shadow-md transition-shadow border-purple-200 hover:border-purple-300"
          >
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
                  클릭: {displayedClicks}/10
                </span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex flex-col gap-2 bg-purple-50">
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => handleInviteClick(invite)}
                disabled={processingIds.has(invite.id)}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                {processingIds.has(invite.id) ? "처리 중..." : "바로 가기"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
