
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
  const maxRetries = 10; // 최대 재시도 횟수 증가
  const baseDelay = 1000; // 기본 지연 시간 최적화
  const processedMessageIdsRef = useRef<Set<string>>(new Set()); // 처리된 메시지 ID 추적
  const lastReconnectTimeRef = useRef<number>(0); // 마지막 재연결 시간 추적
  const reconnectCooldown = 5000; // 재연결 쿨다운(ms)

  // 지수 백오프 지연 시간 계산 개선
  const getBackoffDelay = () => {
    // 지수 백오프 + 약간의 무작위성 추가 (Jitter)
    const jitter = Math.random() * 300;
    return Math.min(baseDelay * Math.pow(1.5, connectionAttemptsRef.current) + jitter, 15000); // 최대 15초
  };

  // 메시지 중복 처리 방지 (개선)
  const addMessageIfNotExists = useCallback((newMsg: ChatMessage) => {
    if (processedMessageIdsRef.current.has(newMsg.id)) {
      console.log("중복 메시지 무시:", newMsg.id);
      return false;
    }
    
    processedMessageIdsRef.current.add(newMsg.id);
    setMessages(prev => [...prev, newMsg]);
    return true;
  }, []);

  // Update messages when initialMessages changes (개선)
  useEffect(() => {
    if (initialMessages.length > 0) {
      console.log("업데이트된 초기 메시지 수신:", initialMessages.length);
      
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
        console.log("메시지 구독 채널 정리 중");
        setSubscriptionStatus('disconnected');
        supabase.removeChannel(channelRef.current);
      } catch (error) {
        console.error("채널 제거 중 오류:", error);
      } finally {
        channelRef.current = null;
      }
    }
  }, []);

  // 채널 상태 로깅 함수 (디버깅 개선)
  const logChannelStatus = useCallback((status: string) => {
    console.log(`실시간 구독 상태: ${status} (시도: ${connectionAttemptsRef.current}/${maxRetries})`);
  }, []);
  
  // 개선된 구독 설정
  const setupMessageSubscription = useCallback(() => {
    if (isCleanedUpRef.current || channelRef.current !== null) return;

    const now = Date.now();
    // 재연결 쿨다운 검사
    if (now - lastReconnectTimeRef.current < reconnectCooldown && connectionAttemptsRef.current > 0) {
      console.log(`재연결 쿨다운 대기 중... (${reconnectCooldown - (now - lastReconnectTimeRef.current)}ms 남음)`);
      setTimeout(setupMessageSubscription, reconnectCooldown - (now - lastReconnectTimeRef.current));
      return;
    }
    
    lastReconnectTimeRef.current = now;
    
    try {
      setSubscriptionStatus('connecting');
      console.log("실시간 메시지 구독 설정 중");
      connectionAttemptsRef.current += 1;
      
      // 채널 구독시 독립된 이름 사용 (타임스탬프로 고유화)
      const channelName = `public:community_messages:${Date.now()}`;
      
      // 채널 생성 및 구독
      channelRef.current = supabase
        .channel(channelName)
        .on('postgres_changes', 
          { 
            event: '*',  // INSERT, UPDATE, DELETE 모두 수신
            schema: 'public', 
            table: 'community_messages' 
          }, 
          (payload) => {
            if (isCleanedUpRef.current) return;
            
            // 이벤트 타입에 따른 처리
            if (payload.eventType === 'INSERT') {
              console.log("새 메시지 수신:", payload);
              const newMsg = payload.new as ChatMessage;
              addMessageIfNotExists(newMsg);
            } else if (payload.eventType === 'DELETE') {
              console.log("메시지 삭제됨:", payload);
              // 필요한 경우 삭제된 메시지 처리 로직 추가
            }
          })
        .subscribe(async (status) => {
          logChannelStatus(status);
          
          if (status === 'SUBSCRIBED') {
            setSubscriptionStatus('connected');
            toast.success("실시간 채팅에 연결되었습니다", { id: "realtime-connected" });
            connectionAttemptsRef.current = 0; // 연결 성공 시 카운터 리셋
          } 
          else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            console.error(`채널 상태 오류: ${status}`);
            setSubscriptionStatus('error');
            
            if (status !== 'CLOSED' && connectionAttemptsRef.current < maxRetries) {
              const delay = getBackoffDelay();
              console.log(`재연결 시도 ${connectionAttemptsRef.current}/${maxRetries}, ${delay}ms 후...`);
              
              // 재연결 지연
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
      console.error("메시지 구독 설정 중 오류:", error);
      toast.error("실시간 채팅 설정 중 오류가 발생했습니다", { id: "realtime-setup-error" });
    }
  }, [cleanupChannel, addMessageIfNotExists, logChannelStatus]);

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

  // 수동 재연결 기능 개선
  const reconnect = useCallback(() => {
    cleanupChannel();
    connectionAttemptsRef.current = 0;
    processedMessageIdsRef.current.clear(); // 재연결 시 메시지 ID 캐시 초기화
    toast.info("채팅 서버에 다시 연결 중...");
    setupMessageSubscription();
  }, [cleanupChannel, setupMessageSubscription]);

  return { messages, setMessages, subscriptionStatus, reconnect };
}
