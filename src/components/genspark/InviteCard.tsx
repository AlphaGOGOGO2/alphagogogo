
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
    if (processing) return;
    
    try {
      onProcessingChange(invite.id, true);
      
      // Open invite URL in new window
      window.open(invite.invite_url, '_blank');
      
      // Calculate new click count
      const newClickCount = displayedClicks + 1;
      
      // Update local state immediately for better UX
      onClickCountChange(invite.id, newClickCount);
      
      // Update click count in database
      const { error: updateError } = await supabase
        .from('genspark_invites')
        .update({ clicks: newClickCount })
        .eq('id', invite.id);
      
      if (updateError) {
        console.error("Error updating click count:", updateError);
        // Revert local state if update fails
        onClickCountChange(invite.id, invite.clicks);
        throw updateError;
      }
      
      // Delete invite if 30 clicks reached
      if (newClickCount >= 30) {
        const { error: deleteError } = await supabase
          .from('genspark_invites')
          .delete()
          .eq('id', invite.id);
        
        if (deleteError) {
          console.error("Error deleting invite:", deleteError);
          throw deleteError;
        }
        
        toast.success("30회 클릭 달성! 초대장이 삭제되었습니다.");
        onInviteUpdate();
      } else {
        // Only trigger a full refresh periodically to avoid too many requests
        onInviteUpdate();
      }
      
    } catch (error) {
      console.error("Error handling invite click:", error);
      toast.error("링크 처리 중 오류가 발생했습니다.");
      // Revert local state if error occurs
      onClickCountChange(invite.id, invite.clicks);
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
