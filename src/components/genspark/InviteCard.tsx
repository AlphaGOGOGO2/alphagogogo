
import React, { useState } from "react";
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

      // Update the click count in Supabase
      const { data, error } = await supabase
        .from('genspark_invites')
        .update({ clicks: clickCount + 1 })
        .eq('id', invite.id)
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setClickCount(data[0].clicks);
        
        // Show success toast if update was successful
        toast({
          title: "클릭 카운트가 업데이트되었습니다.",
          description: `${invite.nickname}의 초대 링크가 ${data[0].clicks}/30회 클릭되었습니다.`,
        });
      }

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
