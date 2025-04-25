
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/chat";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// 기본 설정값
const RETRY_DELAY = 3000; // 3초
const MESSAGE_LIMIT = 100;

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 메시지 로드
  const loadMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('community_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(MESSAGE_LIMIT);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('메시지 로드 실패:', error);
      toast.error('메시지를 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 실시간 구독 설정
  useEffect(() => {
    loadMessages();

    const channel = supabase.channel('chat_messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'community_messages' },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        if (status === 'CHANNEL_ERROR') {
          toast.error('채팅 연결이 끊어졌습니다');
          setTimeout(() => {
            channel.subscribe();
          }, RETRY_DELAY);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadMessages]);

  // 메시지 전송
  const sendMessage = useCallback(async (
    nickname: string,
    content: string,
    userColor: string
  ) => {
    if (!isConnected) {
      toast.error('채팅 서버에 연결되어 있지 않습니다');
      return false;
    }

    try {
      const messageId = uuidv4();
      const { error } = await supabase
        .from('community_messages')
        .insert([{
          id: messageId,
          nickname,
          content,
          color: userColor
        }]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      toast.error('메시지 전송에 실패했습니다');
      return false;
    }
  }, [isConnected]);

  return {
    messages,
    isLoading,
    isConnected,
    sendMessage
  };
}
