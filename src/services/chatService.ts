
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/chat";
import { toast } from "sonner";

export const fetchRecentMessages = async (): Promise<ChatMessage[]> => {
  let retries = 0;
  const maxRetries = 3;
  
  const attemptFetch = async (): Promise<ChatMessage[]> => {
    try {
      console.log("Supabase에서 최근 메시지 가져오는 중");
      
      const { data, error } = await supabase
        .from('community_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50) as { data: ChatMessage[] | null, error: any };
        
      if (error) {
        console.error("최근 메시지 가져오는 중 오류:", error);
        
        if (retries < maxRetries) {
          retries++;
          console.log(`재시도 중... (${retries}/${maxRetries})`);
          // 재시도마다 지연 시간 증가 (300ms, 600ms, 900ms)
          await new Promise(r => setTimeout(r, retries * 300));
          return attemptFetch();
        }
        
        toast.error("메시지를 불러오는데 실패했습니다");
        throw error;
      }
      
      console.log(`성공적으로 ${data?.length || 0}개의 메시지를 가져왔습니다`);
      return data || [];
    } catch (error) {
      console.error("fetchRecentMessages에서 오류:", error);
      toast.error("메시지를 불러오는데 실패했습니다");
      return [];
    }
  };
  
  return attemptFetch();
};

export const sendChatMessage = async (
  messageId: string,
  nickname: string,
  content: string,
  color: string
): Promise<boolean> => {
  let retries = 0;
  const maxRetries = 2;
  
  const attemptSend = async (): Promise<boolean> => {
    try {
      if (!messageId || !nickname || !content) {
        console.error("메시지 전송에 필요한 필드가 누락되었습니다");
        toast.error("메시지 전송에 필요한 정보가 부족합니다");
        return false;
      }
      
      console.log("Supabase에 메시지 전송:", { messageId, nickname, content });
      
      const { error } = await supabase
        .from('community_messages')
        .insert([{
          id: messageId,
          nickname,
          content,
          color
        }]);
        
      if (error) {
        console.error("채팅 메시지 전송 중 오류:", error);
        
        if (retries < maxRetries) {
          retries++;
          console.log(`메시지 전송 재시도 중... (${retries}/${maxRetries})`);
          // 재시도마다 지연 시간 증가 (500ms, 1000ms)
          await new Promise(r => setTimeout(r, retries * 500));
          return attemptSend();
        }
        
        toast.error("메시지 전송에 실패했습니다");
        throw error;
      }
      
      console.log("메시지가 성공적으로 Supabase에 전송되었습니다");
      return true;
    } catch (error) {
      console.error("sendChatMessage에서 오류:", error);
      toast.error("메시지 전송에 실패했습니다");
      return false;
    }
  };
  
  return attemptSend();
};

// 개선된 채널 상태 확인 함수
export const checkChannelHealth = async (): Promise<boolean> => {
  try {
    // 간단한 쿼리로 데이터베이스 연결 상태 확인
    const startTime = Date.now();
    const { data, error } = await supabase
      .from('community_messages')
      .select('created_at')
      .limit(1)
      .maybeSingle();
    
    const responseTime = Date.now() - startTime;
    console.log(`채널 응답 시간: ${responseTime}ms`);
    
    if (error) {
      console.error("채널 상태 확인 실패:", error);
      return false;
    }
    
    // 응답 시간이 비정상적으로 높으면 건강하지 않은 것으로 간주
    if (responseTime > 5000) {
      console.warn("채널 응답 시간이 너무 깁니다");
      return false;
    }
    
    // 연결이 정상적으로 작동하면 true 반환
    return true;
  } catch (error) {
    console.error("채널 상태 확인 중 오류:", error);
    return false;
  }
};
