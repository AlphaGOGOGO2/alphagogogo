
import { useState } from "react";
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
