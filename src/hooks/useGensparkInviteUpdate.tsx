
import { useCallback } from "react";
import { GensparkInvite } from "@/types/genspark";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useGensparkInviteUpdate(
  setLocalInvites: React.Dispatch<React.SetStateAction<GensparkInvite[]>>
) {
  // Handle invite update (e.g., after click)
  const handleUpdateInvite = useCallback(async (updatedInvite: Partial<GensparkInvite>) => {
    console.log("Update invite called with:", updatedInvite);
    
    if (!updatedInvite.id) {
      console.error("Cannot update invite without id");
      return;
    }
    
    try {
      // Ensure clicks is a number when updating
      const clicksValue = typeof updatedInvite.clicks === 'string' 
        ? parseInt(updatedInvite.clicks, 10) 
        : updatedInvite.clicks;
      
      const updateData = {
        ...updatedInvite,
        clicks: clicksValue
      };
      
      // Update database
      const { error } = await supabase
        .from('genspark_invites')
        .update(updateData)
        .eq('id', updatedInvite.id);
      
      if (error) {
        console.error("Error updating invite:", error);
        toast.error("초대 링크 업데이트 중 오류가 발생했습니다");
        return;
      }
      
      // Update local state immediately for responsive UI
      setLocalInvites(prev => 
        prev.map(invite => 
          invite.id === updatedInvite.id 
            ? { ...invite, ...updateData } 
            : invite
        )
      );
      
      console.log("Invite updated successfully");
    } catch (err) {
      console.error("Exception updating invite:", err);
      toast.error("초대 링크 업데이트 중 오류가 발생했습니다");
    }
  }, [setLocalInvites]);

  return { handleUpdateInvite };
}
