
import React, { useState, useEffect } from "react";
import { GensparkInvite } from "@/types/genspark";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InviteCardProps {
  invite: GensparkInvite;
  onUpdateClick?: (updatedInvite: Partial<GensparkInvite>) => void;
}

export function InviteCard({ invite, onUpdateClick }: InviteCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [clickCount, setClickCount] = useState<number>(0);
  const MAX_CLICKS = 30;
  
  // 초기 클릭 수 설정
  useEffect(() => {
    console.log(`InviteCard: 초대 ID 초기화: ${invite.id}, 클릭 수: ${invite.clicks}`);
    
    // 클릭 수가 숫자인지 확인
    const numClicks = typeof invite.clicks === 'number' 
      ? invite.clicks 
      : typeof invite.clicks === 'string' 
        ? parseInt(invite.clicks, 10) 
        : 0;
    
    setClickCount(numClicks || 0);
  }, [invite.id, invite.clicks]);
  
  // 간소화된 클릭 처리 함수
  const handleInviteClick = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      // 먼저 URL을 열어 사용자 경험 개선
      window.open(invite.invite_url, '_blank');
      
      // 새 클릭 수 계산 (낙관적 UI 업데이트)
      const newClickCount = clickCount + 1;
      console.log(`초대 ${invite.id}의 클릭 수를 ${clickCount}에서 ${newClickCount}로 업데이트합니다`);
      
      // 낙관적으로 로컬 상태 업데이트
      setClickCount(newClickCount);
      
      // 데이터베이스 직접 업데이트
      // RPC 대신 일반 업데이트로 변경
      const { data, error } = await supabase
        .from('genspark_invites')
        .update({ clicks: newClickCount })
        .eq('id', invite.id)
        .select();
      
      if (error) {
        console.error("클릭 수 업데이트 오류:", error);
        toast.error("클릭 수를 업데이트하는 중 오류가 발생했습니다");
        // 오류 발생 시 이전 클릭 수로 복원
        setClickCount(clickCount);
        return;
      }
      
      // 클릭 수가 MAX_CLICKS(30)에 가까워지면 알림
      if (newClickCount >= MAX_CLICKS - 3 && newClickCount < MAX_CLICKS) {
        toast.warning(`이 초대 링크는 ${MAX_CLICKS - newClickCount}번 더 클릭하면 삭제됩니다!`);
      }
      
      console.log(`${invite.id}의 클릭 수가 ${newClickCount}로 성공적으로 업데이트되었습니다`);
      
      // 부모 컴포넌트에 업데이트 알림
      if (onUpdateClick && typeof onUpdateClick === 'function') {
        onUpdateClick({
          id: invite.id,
          clicks: newClickCount
        });
      }
      
      // 클릭 수가 최대에 도달하면 삭제 처리
      if (newClickCount >= MAX_CLICKS) {
        toast.success('초대 링크가 최대 클릭 수에 도달하여 자동 삭제됩니다!');
        // 삭제는 백엔드에서 처리됨
      }
    } catch (error) {
      console.error("handleInviteClick 오류:", error);
      toast.error("초대 링크 처리 중 오류가 발생했습니다");
      // 오류 발생 시 이전 클릭 수로 복원
      setClickCount(clickCount);
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
          <span className={`text-xs ${clickCount >= MAX_CLICKS - 5 ? 'bg-red-200 text-red-800' : 'bg-purple-200 text-purple-800'} px-2 py-1 rounded-full`}>
            클릭: {clickCount}{clickCount >= MAX_CLICKS - 5 ? ` / ${MAX_CLICKS}` : ''}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2 bg-purple-50">
        <Button 
          variant="secondary" 
          size="sm" 
          className={`w-full ${clickCount >= MAX_CLICKS - 5 ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
          onClick={handleInviteClick}
          disabled={isLoading}
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          {isLoading ? "처리 중..." : "바로 가기"}
        </Button>
      </CardFooter>
    </Card>
  );
}
