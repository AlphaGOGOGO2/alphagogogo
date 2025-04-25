
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/chat";
import { toast } from "sonner";

export const fetchRecentMessages = async (): Promise<ChatMessage[]> => {
  try {
    console.log("Fetching recent messages from Supabase");
    
    const { data, error } = await supabase
      .from('community_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50) as { data: ChatMessage[] | null, error: any };
      
    if (error) {
      console.error("Error fetching recent messages:", error);
      toast.error("메시지를 불러오는데 실패했습니다");
      throw error;
    }
    
    console.log(`Successfully fetched ${data?.length || 0} messages`);
    return data || [];
  } catch (error) {
    console.error("Error in fetchRecentMessages:", error);
    toast.error("메시지를 불러오는데 실패했습니다");
    return [];
  }
};

export const sendChatMessage = async (
  messageId: string,
  nickname: string,
  content: string,
  color: string
): Promise<boolean> => {
  try {
    if (!messageId || !nickname || !content) {
      console.error("Missing required fields for sending message");
      toast.error("메시지 전송에 필요한 정보가 부족합니다");
      return false;
    }
    
    console.log("Sending message to Supabase:", { messageId, nickname, content });
    
    const { error } = await supabase
      .from('community_messages')
      .insert([{
        id: messageId,
        nickname,
        content,
        color
      }]);
      
    if (error) {
      console.error("Error sending chat message:", error);
      toast.error("메시지 전송에 실패했습니다");
      throw error;
    }
    
    console.log("Message successfully sent to Supabase");
    return true;
  } catch (error) {
    console.error("Error in sendChatMessage:", error);
    toast.error("메시지 전송에 실패했습니다");
    return false;
  }
};

// 채널 상태를 확인하는 함수 추가
export const checkChannelHealth = async (): Promise<boolean> => {
  try {
    // 간단한 쿼리를 실행해서 Supabase 연결 상태 확인
    const { count, error } = await supabase
      .from('community_messages')
      .select('*', { count: 'exact', head: true })
      .limit(1);
    
    if (error) {
      console.error("Channel health check failed:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error checking channel health:", error);
    return false;
  }
};
