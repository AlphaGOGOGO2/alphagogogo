
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { GensparkInvite } from "@/types/genspark";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useGensparkInvitesData(
  setLocalInvites: React.Dispatch<React.SetStateAction<GensparkInvite[]>>
) {
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch invites data
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
  }, [setLocalInvites]);

  const queryResult = useQuery({
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

  return {
    ...queryResult,
    handleDataRefresh
  };
}
