
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { GensparkInvite } from "@/types/genspark";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useGensparkInvites() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [localInvites, setLocalInvites] = useState<GensparkInvite[]>([]);

  // Set up global realtime subscription for all invite changes
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
            setLocalInvites(prev => 
              prev.map(invite => 
                invite.id === payload.new.id 
                  ? { ...invite, ...payload.new } 
                  : invite
              )
            );
          } else if (payload.eventType === 'INSERT' && payload.new) {
            console.log("Processing INSERT event:", payload.new);
            setLocalInvites(prev => [payload.new as GensparkInvite, ...prev]);
          } else if (payload.eventType === 'DELETE' && payload.old) {
            console.log("Processing DELETE event:", payload.old);
            setLocalInvites(prev => 
              prev.filter(invite => invite.id !== payload.old.id)
            );
          }
          
          // Always trigger a fetch after any database change to ensure we have the latest data
          setRefreshKey(prev => prev + 1);
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
  }, []);

  // Use react-query to fetch invites data
  const { data: invites = [], isLoading, error } = useQuery({
    queryKey: ['genspark-invites', refreshKey],
    queryFn: async () => {
      console.log("Fetching invites data...");
      
      try {
        const { data, error } = await supabase
          .from('genspark_invites')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching invites:", error);
          toast.error("초대 링크 목록을 불러오는 중 오류가 발생했습니다");
          throw new Error(error.message);
        }
        
        console.log("Fetched invites data:", data);
        
        // Update local state with the fetched data
        if (data) {
          setLocalInvites(data as GensparkInvite[]);
        }
        
        return data as GensparkInvite[];
      } catch (err) {
        console.error("Exception fetching invites:", err);
        toast.error("초대 링크 목록을 불러오는 중 오류가 발생했습니다");
        throw err;
      }
    },
    staleTime: 30000, // Data is fresh for 30 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Handle manual refresh
  const handleDataRefresh = () => {
    console.log("Manual refresh requested");
    setRefreshKey(prev => prev + 1);
  };

  // Handle invite update (e.g., after click)
  const handleUpdateInvite = (updatedInvite: Partial<GensparkInvite>) => {
    console.log("Update invite called with:", updatedInvite);
    
    if (!updatedInvite.id) {
      console.error("Cannot update invite without id");
      return;
    }
    
    // Update local state immediately for responsive UI
    setLocalInvites(prev => 
      prev.map(invite => 
        invite.id === updatedInvite.id 
          ? { ...invite, ...updatedInvite } 
          : invite
      )
    );
  };

  // Choose which invites to display (prefer local state if available)
  const displayInvites = localInvites.length > 0 ? localInvites : invites;
  
  return {
    invites: displayInvites,
    isLoading,
    error,
    handleDataRefresh,
    handleUpdateInvite
  };
}
