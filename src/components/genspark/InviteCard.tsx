
import React, { useState, useEffect } from "react";
import { GensparkInvite } from "@/types/genspark";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

interface InviteCardProps {
  invite: GensparkInvite;
}

export function InviteCard({ invite }: InviteCardProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [clickCount, setClickCount] = useState(invite.clicks);

  // Initialize click count from the invite prop
  useEffect(() => {
    setClickCount(invite.clicks);
  }, [invite.clicks]);

  // Subscribe to real-time updates for this specific invite
  useEffect(() => {
    // Create a channel to listen for changes to this specific invite
    const channel = supabase
      .channel(`invite-${invite.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'genspark_invites',
          filter: `id=eq.${invite.id}`
        },
        (payload) => {
          if (payload.new && typeof payload.new.clicks === 'number') {
            setClickCount(payload.new.clicks);
          }
        }
      )
      .subscribe();

    // Clean up subscription when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [invite.id]);

  // Get or generate client ID to prevent multiple clicks from same client
  const getClientId = () => {
    let clientId = localStorage.getItem('genspark_client_id');
    if (!clientId) {
      clientId = uuidv4();
      localStorage.setItem('genspark_client_id', clientId);
    }
    return clientId;
  };

  const handleInviteClick = async () => {
    try {
      setIsLoading(true);
      const clientId = getClientId();
      
      // Refresh the current invite data first to get the latest click count
      const { data: currentInvite, error: fetchError } = await supabase
        .from('genspark_invites')
        .select('clicks')
        .eq('id', invite.id)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }

      // Calculate the new click count based on the latest data
      const newClickCount = (currentInvite?.clicks || 0) + 1;
      
      // Update local state first for immediate feedback
      setClickCount(newClickCount);

      // Update the click count in Supabase
      const { error } = await supabase
        .from('genspark_invites')
        .update({ clicks: newClickCount })
        .eq('id', invite.id);

      if (error) {
        // Revert the local state if there was an error
        setClickCount(currentInvite?.clicks || 0);
        throw error;
      }

      // Show success toast if update was successful
      toast({
        title: "클릭 카운트가 업데이트되었습니다.",
        description: `${invite.nickname}의 초대 링크가 ${newClickCount}/30회 클릭되었습니다.`,
      });

      // Open the invite URL in a new tab
      window.open(invite.invite_url, '_blank');
    } catch (error) {
      console.error("Error updating click count:", error);
      toast({
        title: "에러",
        description: "클릭 카운트를 업데이트하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
            클릭: {clickCount}/30
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2 bg-purple-50">
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          onClick={handleInviteClick}
          disabled={isLoading || clickCount >= 30}
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          {isLoading ? "처리 중..." : "바로 가기"}
        </Button>
      </CardFooter>
    </Card>
  );
}
