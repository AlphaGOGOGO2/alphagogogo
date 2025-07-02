
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/chat";
import { toast } from "sonner";
import { checkChannelHealth } from "@/services/chatService";

// 최적화된 설정 상수
const CONNECTION_CONFIG = {
  MAX_RETRIES: 15,               // 최대 재시도 횟수
  BASE_DELAY: 800,               // 기본 지연 시간 최적화
  RECONNECT_COOLDOWN: 5000,      // 5초로 증가 (기존 3초)
  HEARTBEAT_INTERVAL: 30000,     // 하트비트 간격 30초
  MESSAGE_BUFFER_DELAY: 100,     // 메시지 버퍼링 처리 지연시간
  MAX_BACKOFF_DELAY: 15000       // 최대 백오프 지연시간
};

export function useMessageSubscription(initialMessages: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const channelRef = useRef<any>(null);
  const isCleanedUpRef = useRef(false);
  const connectionAttemptsRef = useRef(0);
  const processedMessageIdsRef = useRef<Set<string>>(new Set()); // 처리된 메시지 ID 추적
  const lastReconnectTimeRef = useRef<number>(0); // 마지막 재연결 시간 추적
  const heartbeatIntervalRef = useRef<number | null>(null); // 하트비트 인터벌
  const messagesBufferRef = useRef<Map<string, ChatMessage>>(new Map()); // 메시지 버퍼 추가
  const processingRef = useRef<boolean>(false); // 메시지 처리 중 상태
  const lastHealthCheckRef = useRef<number>(Date.now());
  const healthCheckFailuresRef = useRef(0);
  const channelNameRef = useRef<string>('');
  
  // 연결 복구 전략 향상 - 지수 백오프 지연 시간 계산 개선
  const getBackoffDelay = useCallback(() => {
    const attempt = Math.min(connectionAttemptsRef.current, 10); // 최대 10번째 시도까지만 지수 증가
    // 지수 백오프 + 약간의 무작위성 추가 (Jitter)
    const jitter = Math.random() * 300;
    return Math.min(
      CONNECTION_CONFIG.BASE_DELAY * Math.pow(1.7, attempt) + jitter, 
      CONNECTION_CONFIG.MAX_BACKOFF_DELAY
    );
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
      setTimeout(() => processMessageBuffer(), CONNECTION_CONFIG.MESSAGE_BUFFER_DELAY);
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
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${newMessages.length}개의 새 메시지 추가`);
      }
      
      // 타임스탬프 기준으로 정렬하여 추가
      const allMessages = [...prev, ...newMessages].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      
      // 최대 메시지 수 제한 (성능 최적화)
      if (allMessages.length > 200) {
        return allMessages.slice(allMessages.length - 200);
      }
      
      return allMessages;
    });
    
    processingRef.current = false;
    
    // 버퍼에 메시지가 더 있으면 계속 처리
    if (messagesBufferRef.current.size > 0) {
      setTimeout(() => processMessageBuffer(), CONNECTION_CONFIG.MESSAGE_BUFFER_DELAY);
    }
  }, []);

  // 초기 메시지 업데이트
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      if (process.env.NODE_ENV === 'development') {
        console.log("업데이트된 초기 메시지 수신:", initialMessages.length);
      }
      
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

  // 채널 정리 함수 - 개선됨
  const cleanupChannel = useCallback(() => {
    if (channelRef.current) {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log("메시지 구독 채널 정리 중");
        }
        setSubscriptionStatus('disconnected');
        supabase.removeChannel(channelRef.current);
      } catch (error) {
        console.error("채널 제거 중 오류:", error);
      } finally {
        channelRef.current = null;
        channelNameRef.current = '';
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
    if (process.env.NODE_ENV === 'development') {
      console.log(`실시간 구독 상태: ${status} (시도: ${connectionAttemptsRef.current}/${CONNECTION_CONFIG.MAX_RETRIES})`);
    }
  }, []);
  
  // 채널 상태 확인 함수 추가
  const checkChannelStatus = useCallback(async () => {
    if (channelRef.current && subscriptionStatus === 'connected') {
      const now = Date.now();
      
      // 마지막 상태 확인 후 일정 시간이 지났으면 검사
      if (now - lastHealthCheckRef.current > CONNECTION_CONFIG.HEARTBEAT_INTERVAL) {
        lastHealthCheckRef.current = now;
        
        const isHealthy = await checkChannelHealth();
        
        if (!isHealthy) {
          healthCheckFailuresRef.current++;
          console.warn(`채널 상태 확인 실패 (${healthCheckFailuresRef.current}번째)`);
          
          // 연속 3번 이상 실패하면 연결 재설정
          if (healthCheckFailuresRef.current >= 3) {
            console.error("연속된 채널 상태 확인 실패로 재연결합니다.");
            setSubscriptionStatus('error');
            reconnect();
            return;
          }
        } else {
          // 상태가 정상이면 실패 카운트 리셋
          healthCheckFailuresRef.current = 0;
        }
      }
    }
  }, [subscriptionStatus]);
  
  // 개선된 구독 설정
  const setupMessageSubscription = useCallback(() => {
    // 이미 정리되었거나 채널이 이미 있으면 중복 설정 방지
    if (isCleanedUpRef.current || channelRef.current !== null) return;

    const now = Date.now();
    // 재연결 쿨다운 검사
    if (now - lastReconnectTimeRef.current < CONNECTION_CONFIG.RECONNECT_COOLDOWN && connectionAttemptsRef.current > 0) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`재연결 쿨다운 대기 중... (${CONNECTION_CONFIG.RECONNECT_COOLDOWN - (now - lastReconnectTimeRef.current)}ms 남음)`);
      }
      setTimeout(setupMessageSubscription, CONNECTION_CONFIG.RECONNECT_COOLDOWN - (now - lastReconnectTimeRef.current));
      return;
    }
    
    lastReconnectTimeRef.current = now;
    
    try {
      setSubscriptionStatus('connecting');
      if (process.env.NODE_ENV === 'development') {
        console.log("실시간 메시지 구독 설정 중");
      }
      connectionAttemptsRef.current += 1;
      
      // 채널 구독시 독립된 이름 사용 (타임스탬프로 고유화)
      const channelName = `community_messages:${Date.now()}`;
      channelNameRef.current = channelName;
      
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
              if (process.env.NODE_ENV === 'development') {
                console.log("새 메시지 수신:", payload.new);
              }
              const newMsg = payload.new as ChatMessage;
              addMessageIfNotExists(newMsg);
            }
          })
        .subscribe(async (status) => {
          logChannelStatus(status);
          
          if (status === 'SUBSCRIBED') {
            setSubscriptionStatus('connected');
            connectionAttemptsRef.current = 0; // 연결 성공 시 카운터 리셋
            healthCheckFailuresRef.current = 0; // 상태 확인 실패 카운터 리셋
            
            // 하트비트 인터벌 설정 (연결 유지를 위한 주기적 핑)
            if (heartbeatIntervalRef.current) {
              clearInterval(heartbeatIntervalRef.current);
            }
            
            heartbeatIntervalRef.current = window.setInterval(() => {
              checkChannelStatus();
            }, CONNECTION_CONFIG.HEARTBEAT_INTERVAL) as unknown as number;
          } 
          else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            console.error(`채널 상태 오류: ${status}`);
            setSubscriptionStatus('error');
            
            // 하트비트 인터벌 정리
            if (heartbeatIntervalRef.current) {
              clearInterval(heartbeatIntervalRef.current);
              heartbeatIntervalRef.current = null;
            }
            
            if (status !== 'CLOSED' && connectionAttemptsRef.current < CONNECTION_CONFIG.MAX_RETRIES) {
              const delay = getBackoffDelay();
              if (process.env.NODE_ENV === 'development') {
                console.log(`재연결 시도 ${connectionAttemptsRef.current}/${CONNECTION_CONFIG.MAX_RETRIES}, ${delay}ms 후...`);
              }
              
              // 재연결 지연
              setTimeout(() => {
                if (!isCleanedUpRef.current) {
                  cleanupChannel();
                  setupMessageSubscription();
                }
              }, delay);
            } 
            else if (connectionAttemptsRef.current >= CONNECTION_CONFIG.MAX_RETRIES) {
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
  }, [cleanupChannel, addMessageIfNotExists, logChannelStatus, getBackoffDelay, checkChannelStatus]);

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
    healthCheckFailuresRef.current = 0;
    lastHealthCheckRef.current = Date.now();
    processedMessageIdsRef.current.clear(); // 재연결 시 메시지 ID 캐시 초기화
    messagesBufferRef.current.clear(); // 메시지 버퍼 초기화
    toast.info("채팅 서버에 다시 연결 중...");
    setTimeout(setupMessageSubscription, 800); // 약간의 지연 후 재연결 (이전 연결 정리 시간 확보)
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
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Ping 테스트 결과: ${pingTime}ms`);
      }
      return pingTime;
    } catch (error) {
      console.error("Ping 테스트 중 오류:", error);
      return null;
    }
  }, []);

  // 채널 정보 얻기
  const getChannelInfo = useCallback(() => {
    return {
      channelName: channelNameRef.current,
      healthFailures: healthCheckFailuresRef.current,
      connectionAttempts: connectionAttemptsRef.current,
      lastHealthCheck: new Date(lastHealthCheckRef.current).toISOString()
    };
  }, []);

  return { 
    messages, 
    setMessages, 
    subscriptionStatus, 
    reconnect,
    pingServer,
    getChannelInfo
  };
}
