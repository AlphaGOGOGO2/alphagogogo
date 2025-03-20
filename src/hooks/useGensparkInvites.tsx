
import { useState, useEffect, useCallback } from "react";
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
            
            // Ensure clicks is a number when updating local state
            const updatedInvite = {
              ...payload.new,
              clicks: typeof payload.new.clicks === 'string' 
                ? parseInt(payload.new.clicks, 10) 
                : (payload.new.clicks || 0)
            };
            
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
            };
            
            setLocalInvites(prev => [newInvite as GensparkInvite, ...prev]);
          } else if (payload.eventType === 'DELETE' && payload.old) {
            console.log("Processing DELETE event:", payload.old);
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
  }, []);

  // Use react-query to fetch invites data
  const fetchInvites = useCallback(async () => {
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
      
      if (data) {
        // Ensure clicks are numbers, not strings
        const formattedData = data.map(invite => ({
          ...invite,
          clicks: typeof invite.clicks === 'string' 
            ? parseInt(invite.clicks, 10) 
            : (invite.clicks || 0)
        })) as GensparkInvite[];
        
        console.log("Formatted invites data:", formattedData);
        setLocalInvites(formattedData);
        return formattedData;
      }
      
      return [] as GensparkInvite[];
    } catch (err) {
      console.error("Exception fetching invites:", err);
      toast.error("초대 링크 목록을 불러오는 중 오류가 발생했습니다");
      throw err;
    }
  }, []);

  const { data: invites = [], isLoading, error } = useQuery({
    queryKey: ['genspark-invites', refreshKey],
    queryFn: fetchInvites,
    staleTime: 0, // Always fetch fresh data on navigation
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 30000, // Refetch every 30 seconds to ensure data is fresh
  });

  // Handle manual refresh
  const handleDataRefresh = useCallback(() => {
    console.log("Manual refresh requested");
    setRefreshKey(prev => prev + 1);
  }, []);

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
  }, []);

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
