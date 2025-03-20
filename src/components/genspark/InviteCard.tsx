
import { useState, useEffect } from "react";
import { GensparkInvite } from "@/types/genspark";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InviteCardProps {
  invite: GensparkInvite;
  onInviteUpdate: () => void;
  processing: boolean;
  onProcessingChange: (id: string, isProcessing: boolean) => void;
}

export function InviteCard({ 
  invite, 
  onInviteUpdate, 
  processing, 
  onProcessingChange
}: InviteCardProps) {
  const [localClicks, setLocalClicks] = useState(invite.clicks);
  
  // Synchronize local clicks with invite.clicks when it changes
  useEffect(() => {
    setLocalClicks(invite.clicks);
  }, [invite.clicks]);
  
  const handleInviteClick = async () => {
    if (processing) return;
    
    try {
      onProcessingChange(invite.id, true);
      
      // Immediately open URL
      window.open(invite.invite_url, '_blank');
      
      // Get the current click count from the database to ensure we have the latest
      const { data, error: fetchError } = await supabase
        .from('genspark_invites')
        .select('clicks')
        .eq('id', invite.id)
        .single();
      
      if (fetchError) {
        console.error("클릭 카운트 조회 실패:", fetchError);
        toast.error("클릭 수 조회에 실패했습니다.");
        onProcessingChange(invite.id, false);
        return;
      }
      
      // Use the most up-to-date click count from the database
      const currentClicks = data?.clicks || 0;
      const newClickCount = currentClicks + 1;
      
      // Update local UI immediately
      setLocalClicks(newClickCount);
      
      // Update database with incremented click count
      const { error } = await supabase
        .from('genspark_invites')
        .update({ clicks: newClickCount })
        .eq('id', invite.id);
      
      if (error) {
        console.error("클릭 카운트 업데이트 실패:", error);
        toast.error("클릭 수 업데이트에 실패했습니다.");
        // Revert local state if update fails
        setLocalClicks(currentClicks);
        onProcessingChange(invite.id, false);
        return;
      }
      
      console.log(`초대장 ${invite.id}의 클릭 수가 ${newClickCount}로 업데이트되었습니다.`);
      
      // Check if newClickCount is >= 30 and delete if necessary
      if (newClickCount >= 30) {
        const { error: deleteError } = await supabase
          .from('genspark_invites')
          .delete()
          .eq('id', invite.id);
        
        if (deleteError) {
          console.error("초대장 삭제 실패:", deleteError);
          toast.error("초대장 삭제에 실패했습니다.");
        } else {
          toast.success("30회 클릭 달성! 초대장이 삭제되었습니다.");
        }
      } else {
        toast.success(`클릭 카운트가 ${newClickCount}로 업데이트되었습니다.`);
      }
      
      // Refresh all data from parent to ensure all cards are up-to-date
      onInviteUpdate();
      
    } catch (error) {
      console.error("초대장 처리 중 오류:", error);
      toast.error("초대장 처리 중 오류가 발생했습니다.");
    } finally {
      onProcessingChange(invite.id, false);
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
            클릭: {localClicks}/30
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2 bg-purple-50">
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          onClick={handleInviteClick}
          disabled={processing}
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          {processing ? "처리 중..." : "바로 가기"}
        </Button>
      </CardFooter>
    </Card>
  );
}
