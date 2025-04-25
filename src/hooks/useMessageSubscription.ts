
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
  const maxRetries = 15; // 최대 재시도 횟수 증가
  const baseDelay = 800; // 기본 지연 시간 최적화
  const processedMessageIdsRef = useRef<Set<string>>(new Set()); // 처리된 메시지 ID 추적
  const lastReconnectTimeRef = useRef<number>(0); // 마지막 재연결 시간 추적
  const reconnectCooldown = 3000; // 재연결 쿨다운(ms)
  const heartbeatIntervalRef = useRef<number | null>(null); // 하트비트 인터벌
  const messagesBufferRef = useRef<Map<string, ChatMessage>>(new Map()); // 메시지 버퍼 추가
  const processingRef = useRef<boolean>(false); // 메시지 처리 중 상태
  
  // 연결 복구 전략 향상 - 지수 백오프 지연 시간 계산 개선
  const getBackoffDelay = useCallback(() => {
    const attempt = Math.min(connectionAttemptsRef.current, 10); // 최대 10번째 시도까지만 지수 증가
    // 지수 백오프 + 약간의 무작위성 추가 (Jitter)
    const jitter = Math.random() * 300;
    return Math.min(baseDelay * Math.pow(1.5, attempt) + jitter, 12000); // 최대 12초
  }, []);

  // 개선된 메시지 중복 처리 함수
  const addMessageIfNotExists = useCallback((newMsg: ChatMessage) => {
    if (!newMsg?.id) {
      console.warn("ID가 없는 메시지 무시");
      return false;
    }
    
    // 이미 처리된 메시지인지 확인
    if (processedMessageIdsRef.current.has(newMsg.id)) {
      console.log("중복 메시지 무시:", newMsg.id);
      return false;
    }
    
    // 메시지를 버퍼에 추가하고 일괄 처리 스케줄링
    messagesBufferRef.current.set(newMsg.id, newMsg);
    processedMessageIdsRef.current.add(newMsg.id);
    
    // 이미 처리 중이 아니라면 일괄 처리 일정 잡기
    if (!processingRef.current) {
      processingRef.current = true;
      setTimeout(() => processMessageBuffer(), 50);
    }
    
    return true;
  }, []);

  // 메시지 버퍼 일괄 처리 함수
  const processMessageBuffer = useCallback(() => {
    if (messagesBufferRef.current.size === 0) {
      processingRef.current = false;
      return;
    }
    
    const bufferMessages = Array.from(messagesBufferRef.current.values());
    messagesBufferRef.current.clear();
    
    setMessages(prev => {
      // 이미 존재하는 메시지 필터링
      const newMessages = bufferMessages.filter(newMsg => 
        !prev.some(existingMsg => existingMsg.id === newMsg.id)
      );
      
      if (newMessages.length === 0) {
        return prev; // 새 메시지가 없으면 상태 변경 안함
      }
      
      console.log(`${newMessages.length}개의 새 메시지 추가`);
      return [...prev, ...newMessages];
    });
    
    processingRef.current = false;
  }, []);

  // 초기 메시지 업데이트
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      console.log("업데이트된 초기 메시지 수신:", initialMessages.length);
      
      // 초기화 시 메시지 ID 추적 세트 업데이트
      const newMessageIds = new Set<string>();
      initialMessages.forEach(msg => {
        if (msg?.id) {
          newMessageIds.add(msg.id);
        }
      });
      processedMessageIdsRef.current = newMessageIds;
      
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  // 채널 정리 함수
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
    
    // 하트비트 인터벌 정리
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  // 채널 상태 로깅 함수
  const logChannelStatus = useCallback((status: string) => {
    console.log(`실시간 구독 상태: ${status} (시도: ${connectionAttemptsRef.current}/${maxRetries})`);
  }, []);
  
  // 개선된 구독 설정
  const setupMessageSubscription = useCallback(() => {
    // 이미 정리되었거나 채널이 이미 있으면 중복 설정 방지
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
      const channelName = `community_messages:${Date.now()}`;
      
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
              console.log("새 메시지 수신:", payload.new);
              const newMsg = payload.new as ChatMessage;
              addMessageIfNotExists(newMsg);
            }
          })
        .subscribe(async (status) => {
          logChannelStatus(status);
          
          if (status === 'SUBSCRIBED') {
            setSubscriptionStatus('connected');
            connectionAttemptsRef.current = 0; // 연결 성공 시 카운터 리셋
            
            // 하트비트 인터벌 설정 (연결 유지를 위한 주기적 핑)
            if (heartbeatIntervalRef.current) {
              clearInterval(heartbeatIntervalRef.current);
            }
            
            heartbeatIntervalRef.current = window.setInterval(() => {
              if (channelRef.current) {
                // 채널이 살아있는지 확인하는 간단한 핑 작업
                supabase.from('community_messages')
                  .select('created_at')
                  .limit(1)
                  .then(() => {
                    console.log("채널 하트비트 성공");
                  })
                  .then(undefined, (err) => {  // catch 대신 then의 두 번째 인자로 에러 핸들링
                    console.error("채널 하트비트 실패:", err);
                    // 하트비트 실패 시 연결 상태를 오류로 설정
                    setSubscriptionStatus('error');
                  });
              }
            }, 30000) as unknown as number; // 30초마다 하트비트 전송
          } 
          else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            console.error(`채널 상태 오류: ${status}`);
            setSubscriptionStatus('error');
            
            // 하트비트 인터벌 정리
            if (heartbeatIntervalRef.current) {
              clearInterval(heartbeatIntervalRef.current);
              heartbeatIntervalRef.current = null;
            }
            
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
              toast.error("채팅 연결에 실패했습니다. 페이지를 새로고침해주세요.", { 
                id: "realtime-failed",
                duration: 10000
              });
            }
          }
        });
    } catch (error) {
      setSubscriptionStatus('error');
      console.error("메시지 구독 설정 중 오류:", error);
      toast.error("실시간 채팅 설정 중 오류가 발생했습니다", { 
        id: "realtime-setup-error",
        duration: 5000
      });
    }
  }, [cleanupChannel, addMessageIfNotExists, logChannelStatus, getBackoffDelay, processMessageBuffer]);

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
    messagesBufferRef.current.clear(); // 메시지 버퍼 초기화
    toast.info("채팅 서버에 다시 연결 중...");
    setTimeout(setupMessageSubscription, 500); // 약간의 지연 후 재연결 (이전 연결 정리 시간 확보)
  }, [cleanupChannel, setupMessageSubscription]);
  
  // Ping 테스트 실행 (연결 상태 진단용)
  const pingServer = useCallback(async (): Promise<number | null> => {
    try {
      const startTime = Date.now();
      const { data, error } = await supabase
        .from('community_messages')
        .select('count()')
        .limit(1)
        .single();
      
      if (error) {
        console.error("Ping 테스트 실패:", error);
        return null;
      }
      
      const endTime = Date.now();
      const pingTime = endTime - startTime;
      
      console.log(`Ping 테스트 결과: ${pingTime}ms`);
      return pingTime;
    } catch (error) {
      console.error("Ping 테스트 중 오류:", error);
      return null;
    }
  }, []);

  return { 
    messages, 
    setMessages, 
    subscriptionStatus, 
    reconnect,
    pingServer 
  };
}
