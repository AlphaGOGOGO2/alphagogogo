
import { useState } from "react";
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
  localClickCount?: number;
  onClickCountChange: (id: string, count: number) => void;
}

export function InviteCard({ 
  invite, 
  onInviteUpdate, 
  processing, 
  onProcessingChange,
  localClickCount,
  onClickCountChange
}: InviteCardProps) {
  // Use local click count if provided, otherwise use the invite's click count
  const displayedClicks = localClickCount !== undefined ? localClickCount : invite.clicks;

  const handleInviteClick = async () => {
    // Prevent multiple clicks while processing
    if (processing) return;
    
    try {
      // Start processing
      onProcessingChange(invite.id, true);
      
      // 1. First open the URL - this is the primary action
      window.open(invite.invite_url, '_blank');
      
      // 2. Update the local UI immediately for responsiveness
      const newClickCount = displayedClicks + 1;
      onClickCountChange(invite.id, newClickCount);
      
      // 3. Update the database in the background
      const { error } = await supabase
        .from('genspark_invites')
        .update({ clicks: newClickCount })
        .eq('id', invite.id);
      
      if (error) {
        console.error("클릭 카운트 업데이트 실패:", error);
        // Revert UI if database update fails
        onClickCountChange(invite.id, invite.clicks);
        toast.error("클릭 수 업데이트에 실패했습니다.");
        return;
      }
      
      // 4. Handle 30 clicks case - delete the invite
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
      }
      
      // 5. Always refresh the parent component to show correct data
      onInviteUpdate();
      
    } catch (error) {
      // Basic error handling with meaningful message
      console.error("초대장 처리 중 오류:", error);
      toast.error("초대장 처리 중 오류가 발생했습니다.");
      
      // Reset to the original count
      onClickCountChange(invite.id, invite.clicks);
    } finally {
      // Always reset processing state
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
            클릭: {displayedClicks}/30
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
