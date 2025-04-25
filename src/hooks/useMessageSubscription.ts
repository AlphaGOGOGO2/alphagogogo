
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
  const maxRetries = 3;
  const backoffDelay = 2000; // 2초 (고정 백오프)

  // Update messages when initialMessages changes
  useEffect(() => {
    if (initialMessages.length > 0) {
      console.log("Updating messages with initialMessages:", initialMessages.length);
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

  // Setup subscription
  const setupMessageSubscription = useCallback(() => {
    if (isCleanedUpRef.current) return;
    
    try {
      setSubscriptionStatus('connecting');
      console.log("Setting up real-time message subscription");
      connectionAttemptsRef.current += 1;
      
      // Create and subscribe to the channel
      channelRef.current = supabase
        .channel('public:community_messages')
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
            
            // Add message to state if it doesn't already exist
            setMessages(prev => {
              if (prev.some(msg => msg.id === newMsg.id)) {
                return prev;
              }
              return [...prev, newMsg];
            });
          })
        .subscribe((status) => {
          console.log(`Real-time subscription status: ${status}`);
          if (status === 'SUBSCRIBED') {
            setSubscriptionStatus('connected');
            toast.success("실시간 채팅에 연결되었습니다");
            // 성공적으로 연결되면 시도 카운터 초기화
            connectionAttemptsRef.current = 0;
          } else if (status === 'CHANNEL_ERROR') {
            setSubscriptionStatus('error');
            toast.error("실시간 채팅 연결에 실패했습니다");
            // 재시도 로직
            if (connectionAttemptsRef.current < maxRetries) {
              console.log(`재연결 시도 ${connectionAttemptsRef.current}/${maxRetries}...`);
              const timeout = setTimeout(() => {
                if (!isCleanedUpRef.current) {
                  cleanupChannel();
                  setupMessageSubscription();
                }
              }, backoffDelay);
              
              return () => clearTimeout(timeout);
            } else {
              console.error("최대 재시도 횟수에 도달했습니다.");
              toast.error("채팅 연결에 실패했습니다. 페이지를 새로고침해주세요.");
            }
          } else if (status === 'TIMED_OUT') {
            setSubscriptionStatus('error');
            toast.error("연결 시간이 초과되었습니다");
            // 타임아웃 시에도 재시도 로직 추가
            if (connectionAttemptsRef.current < maxRetries) {
              const timeout = setTimeout(() => {
                if (!isCleanedUpRef.current) {
                  cleanupChannel();
                  setupMessageSubscription();
                }
              }, backoffDelay);
              
              return () => clearTimeout(timeout);
            }
          }
        });
    } catch (error) {
      console.error("Error setting up message subscription:", error);
      setSubscriptionStatus('error');
      toast.error("실시간 채팅 연결에 실패했습니다");
    }
  }, [cleanupChannel]);

  // Setup subscription on initial mount
  useEffect(() => {
    isCleanedUpRef.current = false;
    
    // Only set up subscription if one doesn't exist already
    if (channelRef.current === null) {
      setupMessageSubscription();
    }
    
    return () => {
      isCleanedUpRef.current = true;
      cleanupChannel();
    };
  }, [setupMessageSubscription, cleanupChannel]);

  const reconnect = useCallback(() => {
    cleanupChannel();
    connectionAttemptsRef.current = 0;
    setupMessageSubscription();
  }, [cleanupChannel, setupMessageSubscription]);

  return { messages, setMessages, subscriptionStatus, reconnect };
}
