
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
      // Set processing state
      onProcessingChange(invite.id, true);
      
      // Open invite URL in new window first - this is what the user wants most
      window.open(invite.invite_url, '_blank');
      
      // Calculate new click count
      const newClickCount = displayedClicks + 1;
      
      // Update local state immediately for responsive UI
      onClickCountChange(invite.id, newClickCount);
      
      // Simple update to database - just increment the clicks
      const { error } = await supabase
        .from('genspark_invites')
        .update({ clicks: newClickCount })
        .eq('id', invite.id);
      
      // Handle database update error
      if (error) {
        console.error("클릭 카운트 업데이트 오류:", error);
        // Reset to original count on error
        onClickCountChange(invite.id, invite.clicks);
        toast.error("클릭 수 업데이트 중 오류가 발생했습니다.");
        return;
      }
      
      // Check if we need to delete the invite (30 clicks reached)
      if (newClickCount >= 30) {
        const { error: deleteError } = await supabase
          .from('genspark_invites')
          .delete()
          .eq('id', invite.id);
        
        if (deleteError) {
          console.error("초대장 삭제 오류:", deleteError);
          toast.error("초대장 삭제 중 오류가 발생했습니다.");
        } else {
          toast.success("30회 클릭 달성! 초대장이 삭제되었습니다.");
        }
        
        // Always refresh the list after deletion attempt
        onInviteUpdate();
      } else {
        // If not deleted, still refresh the list to show updated count
        onInviteUpdate();
      }
    } catch (error) {
      console.error("초대장 처리 오류:", error);
      toast.error("링크 처리 중 오류가 발생했습니다.");
      
      // Reset count on any error
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
