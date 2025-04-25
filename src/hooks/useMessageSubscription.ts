
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/chat";
import { toast } from "sonner";

export function useMessageSubscription(initialMessages: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const channelRef = useRef<any>(null);
  const isCleanedUpRef = useRef(false);
  const connectionAttemptsRef = useRef(0);
  const maxRetries = 7; // 최대 재시도 횟수 증가
  const baseDelay = 1500; // 기본 지연 시간 조정
  const processedMessageIdsRef = useRef<Set<string>>(new Set()); // 처리된 메시지 ID 추적

  // 지수 백오프 지연 시간 계산 개선
  const getBackoffDelay = () => {
    // 지수 백오프 + 약간의 무작위성 추가 (Jitter)
    const jitter = Math.random() * 500;
    return Math.min(baseDelay * Math.pow(1.5, connectionAttemptsRef.current) + jitter, 20000); // 최대 20초
  };

  // 메시지 중복 처리 방지
  const addMessageIfNotExists = useCallback((newMsg: ChatMessage) => {
    if (processedMessageIdsRef.current.has(newMsg.id)) {
      console.log("중복 메시지 무시:", newMsg.id);
      return false;
    }
    
    processedMessageIdsRef.current.add(newMsg.id);
    setMessages(prev => [...prev, newMsg]);
    return true;
  }, []);

  // Update messages when initialMessages changes
  useEffect(() => {
    if (initialMessages.length > 0) {
      console.log("Updating messages with initialMessages:", initialMessages.length);
      
      // 초기화 시 메시지 ID 추적 세트 업데이트
      const newMessageIds = new Set<string>();
      initialMessages.forEach(msg => newMessageIds.add(msg.id));
      processedMessageIdsRef.current = newMessageIds;
      
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  const cleanupChannel = useCallback(() => {
    if (channelRef.current) {
      try {
        console.log("Cleaning up message subscription channel");
        supabase.removeChannel(channelRef.current);
      } catch (error) {
        console.error("Error removing channel:", error);
      } finally {
        channelRef.current = null;
      }
    }
  }, []);

  // 개선된 구독 설정
  const setupMessageSubscription = useCallback(() => {
    if (isCleanedUpRef.current || channelRef.current !== null) return;
    
    try {
      setSubscriptionStatus('connecting');
      console.log("Setting up real-time message subscription");
      connectionAttemptsRef.current += 1;
      
      // 채널 구독 전에 채널 이름 고유화 (캐싱 방지)
      const timestamp = Date.now();
      const channelName = `public:community_messages:${timestamp}`;
      
      // 채널 생성 및 구독
      channelRef.current = supabase
        .channel(channelName)
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'community_messages' 
          }, 
          (payload) => {
            if (isCleanedUpRef.current) return;
            
            console.log("Received new message from Supabase:", payload);
            const newMsg = payload.new as ChatMessage;
            addMessageIfNotExists(newMsg);
          })
        .subscribe(async (status) => {
          console.log(`Real-time subscription status: ${status}`);
          
          if (status === 'SUBSCRIBED') {
            setSubscriptionStatus('connected');
            toast.success("실시간 채팅에 연결되었습니다", { id: "realtime-connected" });
            connectionAttemptsRef.current = 0;
          } 
          else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            console.error(`채널 상태 오류: ${status}`);
            setSubscriptionStatus('error');
            
            if (status !== 'CLOSED' && connectionAttemptsRef.current < maxRetries) {
              const delay = getBackoffDelay();
              console.log(`재연결 시도 ${connectionAttemptsRef.current}/${maxRetries}, ${delay}ms 후...`);
              
              setTimeout(() => {
                if (!isCleanedUpRef.current) {
                  cleanupChannel();
                  setupMessageSubscription();
                }
              }, delay);
            } 
            else if (connectionAttemptsRef.current >= maxRetries) {
              console.error("최대 재시도 횟수에 도달했습니다.");
              toast.error("채팅 연결에 실패했습니다. 페이지를 새로고침해주세요.", { id: "realtime-failed" });
            }
          }
        });
    } catch (error) {
      setSubscriptionStatus('error');
      console.error("Error setting up message subscription:", error);
      toast.error("실시간 채팅 설정 중 오류가 발생했습니다", { id: "realtime-setup-error" });
    }
  }, [cleanupChannel, addMessageIfNotExists]);

  useEffect(() => {
    isCleanedUpRef.current = false;
    
    // 구독 설정
    setupMessageSubscription();
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      isCleanedUpRef.current = true;
      cleanupChannel();
    };
  }, [setupMessageSubscription, cleanupChannel]);

  const reconnect = useCallback(() => {
    cleanupChannel();
    connectionAttemptsRef.current = 0;
    processedMessageIdsRef.current.clear(); // 재연결 시 메시지 ID 캐시 초기화
    setupMessageSubscription();
  }, [cleanupChannel, setupMessageSubscription]);

  return { messages, setMessages, subscriptionStatus, reconnect };
}
