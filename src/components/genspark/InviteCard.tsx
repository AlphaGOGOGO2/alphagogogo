
import React, { useState, useEffect } from "react";
import { GensparkInvite } from "@/types/genspark";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getClientId } from "@/utils/clientIdUtils";
import { toast } from "sonner";

interface InviteCardProps {
  invite: GensparkInvite;
  onUpdateClick?: (updatedInvite: Partial<GensparkInvite>) => void;
}

export function InviteCard({ invite, onUpdateClick }: InviteCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [clickCount, setClickCount] = useState(invite.clicks || 0);
  
  // Initialize click count and set up realtime subscription
  useEffect(() => {
    setClickCount(invite.clicks || 0);
    console.log(`InviteCard: Initializing card for invite ID: ${invite.id}, clicks: ${invite.clicks}`);
    
    // Set up realtime subscription for this specific invite
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
          console.log(`Realtime update for invite ${invite.id}:`, payload);
          
          if (payload.new && typeof payload.new.clicks === 'number') {
            console.log(`Setting click count to ${payload.new.clicks} for invite ${invite.id}`);
            setClickCount(payload.new.clicks);
            
            // Notify parent component about the update if callback is provided
            if (onUpdateClick && typeof onUpdateClick === 'function') {
              onUpdateClick({
                id: invite.id,
                clicks: payload.new.clicks
              });
            }
          }
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for invite ${invite.id}: ${status}`);
      });
    
    // Clean up subscription when component unmounts
    return () => {
      console.log(`Cleaning up subscription for invite ${invite.id}`);
      supabase.removeChannel(channel);
    };
  }, [invite.id, invite.clicks, onUpdateClick]);
  
  const handleInviteClick = async () => {
    try {
      setIsLoading(true);
      const clientId = getClientId();
      console.log(`Handling click for invite ${invite.id} with client ID ${clientId}`);
      
      // Directly update the clicks count with a SQL update instead of using RPC
      console.log(`Updating click count for invite ${invite.id}`);
      const { data, error } = await supabase
        .from('genspark_invites')
        .update({ clicks: clickCount + 1 })
        .eq('id', invite.id)
        .select();
      
      if (error) {
        console.error("Error incrementing click count:", error);
        toast.error("클릭 수를 업데이트하는 중 오류가 발생했습니다");
        return;
      }
      
      console.log(`Successfully updated click count for ${invite.id}`, data);
      
      // Open the invite URL
      window.open(invite.invite_url, '_blank');
      
      // Optimistically update local state
      const newClickCount = clickCount + 1;
      setClickCount(newClickCount);
      
      // Notify parent component about the update if callback is provided
      if (onUpdateClick && typeof onUpdateClick === 'function') {
        onUpdateClick({
          id: invite.id,
          clicks: newClickCount
        });
      }
    } catch (error) {
      console.error("Error in handleInviteClick:", error);
      toast.error("초대 링크 처리 중 오류가 발생했습니다");
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
            클릭: {clickCount}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2 bg-purple-50">
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          onClick={handleInviteClick}
          disabled={isLoading}
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          {isLoading ? "처리 중..." : "바로 가기"}
        </Button>
      </CardFooter>
    </Card>
  );
}
