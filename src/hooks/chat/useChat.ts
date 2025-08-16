import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/chat";
import { sanitizeText } from "@/utils/sanitization";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // 채널 구독 상태 추적
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef<boolean>(false);

  // 메시지 불러오기
  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("community_messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(100);

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        setMessages(data);
      }
    } catch (err: any) {
      console.error("메시지 로딩 오류:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 실시간 메시지 구독
  useEffect(() => {
    fetchMessages();

    // 이미 구독 중인지 확인
    if (isSubscribedRef.current) return;

    try {
      // 기존 채널이 있으면 제거
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }

      // 새 채널 생성 및 구독
      const channel = supabase
        .channel("community-chat")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "community_messages",
          },
          (payload) => {
            // 새 메시지 추가
            setMessages((prev) => [...prev, payload.new as ChatMessage]);
          }
        )
        .subscribe((status) => {
          setIsConnected(status === "SUBSCRIBED");
          isSubscribedRef.current = status === "SUBSCRIBED";
          if (process.env.NODE_ENV === 'development') {
            console.log("채팅 채널 상태:", status);
          }
        });

      // 채널 참조 저장
      channelRef.current = channel;

      return () => {
        // 컴포넌트 언마운트 시 구독 해제
        if (channelRef.current) {
          if (process.env.NODE_ENV === 'development') {
            console.log("채팅 채널 구독 해제");
          }
          channelRef.current.unsubscribe();
          isSubscribedRef.current = false;
        }
      };
    } catch (err: any) {
      console.error("실시간 구독 오류:", err);
      setError(err);
      setIsConnected(false);
    }
  }, [fetchMessages]);

  // 메시지 전송
  const sendMessage = async (nickname: string, content: string, color: string) => {
    try {
      const trimmed = content.trim();
      if (!trimmed) return;

      const safeContent = sanitizeText(trimmed).slice(0, 500);
      const safeNickname = sanitizeText(nickname).slice(0, 20) || '익명';
      
      const { error } = await supabase.from("community_messages").insert([
        {
          id: crypto.randomUUID(),
          nickname: safeNickname,
          content: safeContent,
          color,
        },
      ]);

      if (error) throw error;
    } catch (err: any) {
      console.error("메시지 전송 오류:", err);
      throw err;
    }
  };

  return {
    messages,
    isLoading,
    isConnected,
    sendMessage,
    error,
  };
}
