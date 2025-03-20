
import { useState, useEffect } from "react";
import { GensparkInvite } from "@/types/genspark";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useGensparkRealtimeSubscription(
  setLocalInvites: React.Dispatch<React.SetStateAction<GensparkInvite[]>>
) {
  useEffect(() => {
    console.log("Setting up global realtime subscription for genspark_invites table");
    
    // Enable realtime functionality for the table
    const enableRealtime = async () => {
      try {
        const { error } = await supabase.rpc('enable_realtime_for_genspark_invites');
        if (error) {
          console.error("Error enabling realtime:", error);
        } else {
          console.log("Successfully enabled realtime for genspark_invites");
        }
      } catch (err) {
        console.error("Exception enabling realtime:", err);
      }
    };
    
    enableRealtime();
    
    // Create a channel to listen for all changes to the genspark_invites table
    const channel = supabase
      .channel('genspark_invites_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'genspark_invites'
        },
        (payload) => {
          console.log("Database change detected:", payload);
          
          if (payload.eventType === 'UPDATE' && payload.new) {
            console.log("Processing UPDATE event:", payload.new);
            
            // Ensure clicks is a number when updating local state
            const updatedInvite = {
              ...payload.new,
              clicks: typeof payload.new.clicks === 'string' 
                ? parseInt(payload.new.clicks, 10) 
                : (payload.new.clicks || 0)
            } as GensparkInvite;
            
            setLocalInvites(prev => 
              prev.map(invite => 
                invite.id === updatedInvite.id 
                  ? updatedInvite 
                  : invite
              )
            );
          } else if (payload.eventType === 'INSERT' && payload.new) {
            console.log("Processing INSERT event:", payload.new);
            
            // Ensure clicks is a number when adding to local state
            const newInvite = {
              ...payload.new,
              clicks: typeof payload.new.clicks === 'string' 
                ? parseInt(payload.new.clicks, 10) 
                : (payload.new.clicks || 0)
            } as GensparkInvite;
            
            setLocalInvites(prev => [newInvite, ...prev]);
          } else if (payload.eventType === 'DELETE' && payload.old) {
            console.log("Processing DELETE event:", payload.old);
            
            // 삭제된 초대 링크가 30회 클릭에 도달한 경우 알림
            if (payload.old.clicks >= 30) {
              toast.success(`'${payload.old.nickname}'님의 초대 링크가 30회 클릭 도달로 자동 삭제되었습니다!`, {
                description: "초대에 참여해주셔서 감사합니다."
              });
            }
            
            setLocalInvites(prev => 
              prev.filter(invite => invite.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    // Clean up subscription when component unmounts
    return () => {
      console.log("Cleaning up global realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [setLocalInvites]);
}
