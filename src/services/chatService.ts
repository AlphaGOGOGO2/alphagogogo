
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

// 개선된 채널 상태 확인 함수
export const checkChannelHealth = async (): Promise<boolean> => {
  try {
    // 간단한 쿼리로 데이터베이스 연결 상태 확인
    const { data, error } = await supabase
      .from('community_messages')
      .select('created_at')
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error("채널 상태 확인 실패:", error);
      return false;
    }
    
    // 연결이 정상적으로 작동하면 true 반환
    return true;
  } catch (error) {
    console.error("채널 상태 확인 중 오류:", error);
    return false;
  }
};
