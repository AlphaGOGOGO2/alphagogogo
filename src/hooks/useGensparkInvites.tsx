
import { useState, useEffect } from "react";
import { GensparkInvite } from "@/types/genspark";
import { useGensparkRealtimeSubscription } from "./useGensparkRealtimeSubscription";
import { useGensparkInvitesData } from "./useGensparkInvitesData";
import { useGensparkInviteUpdate } from "./useGensparkInviteUpdate";

export function useGensparkInvites() {
  const [localInvites, setLocalInvites] = useState<GensparkInvite[]>([]);

  // Set up realtime subscription
  useGensparkRealtimeSubscription(setLocalInvites);

  // Fetch invites data
  const { data: invites = [], isLoading, error, handleDataRefresh } = useGensparkInvitesData(setLocalInvites);

  // Handle invite updates
  const { handleUpdateInvite } = useGensparkInviteUpdate(setLocalInvites);

  // 클릭 수 기준으로 localInvites 정렬
  useEffect(() => {
    if (localInvites.length > 0) {
      const sortedInvites = [...localInvites].sort((a, b) => {
        // 클릭 수 내림차순 정렬 (높은 것이 먼저)
        const clicksA = typeof a.clicks === 'number' ? a.clicks : 0;
        const clicksB = typeof b.clicks === 'number' ? b.clicks : 0;
        
        if (clicksB !== clicksA) {
          return clicksB - clicksA;
        }
        
        // 클릭 수가 같으면 최신순 정렬
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      
      if (JSON.stringify(sortedInvites) !== JSON.stringify(localInvites)) {
        setLocalInvites(sortedInvites);
      }
    }
  }, [localInvites]);

  // Choose which invites to display (prefer local state if available)
  const displayInvites = localInvites.length > 0 ? localInvites : invites;
  
  console.log("Current displayInvites:", displayInvites);
  
  return {
    invites: displayInvites,
    isLoading,
    error,
    handleDataRefresh,
    handleUpdateInvite
  };
}
