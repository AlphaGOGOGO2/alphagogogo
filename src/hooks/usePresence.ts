
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserPresence } from "@/types/chat";
import { toast } from "sonner";

export function usePresence(nickname: string, userColor: string) {
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
  const [presenceStatus, setPresenceStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const presenceChannelRef = useRef<any>(null);
  const presenceInitializedRef = useRef(false);
  const isCleanedUpRef = useRef(false);
  const connectionAttemptsRef = useRef(0);
  const maxRetries = 10;
  const baseDelay = 1000;
  const lastReconnectTimeRef = useRef<number>(0);
  const reconnectCooldown = 5000;

  const getBackoffDelay = () => {
    // 지수 백오프 + 약간의 무작위성 추가 (Jitter)
    const jitter = Math.random() * 300;
    return Math.min(baseDelay * Math.pow(1.5, connectionAttemptsRef.current) + jitter, 15000);
  };

  // Cleanup presence channel
  const cleanupPresenceChannel = useCallback(() => {
    if (presenceChannelRef.current) {
      try {
        console.log("Presence 채널 정리 중");
        setPresenceStatus('disconnected');
        supabase.removeChannel(presenceChannelRef.current);
      } catch (error) {
        console.error("Presence 채널 제거 중 오류:", error);
      } finally {
        presenceChannelRef.current = null;
        presenceInitializedRef.current = false;
      }
    }
  }, []);

  // 로그 채널 상태
  const logChannelStatus = useCallback((status: string) => {
    console.log(`Presence 채널 상태: ${status} (시도: ${connectionAttemptsRef.current}/${maxRetries})`);
  }, []);

  // 개선된 Presence 채널 설정
  const setupPresenceChannel = useCallback(() => {
    if (presenceChannelRef.current !== null || isCleanedUpRef.current || !nickname || !userColor) return;

    const now = Date.now();
    // 재연결 쿨다운 검사
    if (now - lastReconnectTimeRef.current < reconnectCooldown && connectionAttemptsRef.current > 0) {
      console.log(`Presence 재연결 쿨다운 대기 중... (${reconnectCooldown - (now - lastReconnectTimeRef.current)}ms 남음)`);
      setTimeout(setupPresenceChannel, reconnectCooldown - (now - lastReconnectTimeRef.current));
      return;
    }
    
    lastReconnectTimeRef.current = now;

    try {
      console.log(`사용자를 위한 presence 채널 설정: ${nickname}`);
      setPresenceStatus('connecting');
      connectionAttemptsRef.current += 1;
      
      // 타임스탬프로 고유한 채널 이름 생성 (캐싱 방지)
      const channelName = `room:community:${Date.now()}`;
      
      presenceChannelRef.current = supabase.channel(channelName, {
        config: {
          presence: {
            key: nickname,
          },
        },
      });

      presenceChannelRef.current
        .on('presence', { event: 'sync' }, () => {
          if (isCleanedUpRef.current) return;
          
          try {
            const state = presenceChannelRef.current.presenceState();
            const users: UserPresence[] = [];
            
            Object.keys(state).forEach(key => {
              state[key].forEach((presence: UserPresence) => {
                users.push(presence);
              });
            });
            
            setActiveUsers(users);
          } catch (error) {
            console.error("Presence 상태 처리 중 오류:", error);
          }
        })
        .subscribe(async (status: string) => {
          logChannelStatus(status);
          
          if (status === 'SUBSCRIBED' && !isCleanedUpRef.current) {
            try {
              await presenceChannelRef.current.track({
                nickname: nickname,
                color: userColor,
                online_at: new Date().toISOString(),
              });
              presenceInitializedRef.current = true;
              connectionAttemptsRef.current = 0;
              setPresenceStatus('connected');
            } catch (error) {
              console.error("Presence 추적 중 오류:", error);
              setPresenceStatus('error');
            }
          } 
          else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            console.error(`Presence 채널 상태 오류: ${status}`);
            setPresenceStatus('error');
            
            if (status !== 'CLOSED' && connectionAttemptsRef.current < maxRetries) {
              const delay = getBackoffDelay();
              console.log(`Presence 재연결 시도 ${connectionAttemptsRef.current}/${maxRetries}, ${delay}ms 후...`);
              
              setTimeout(() => {
                if (!isCleanedUpRef.current) {
                  cleanupPresenceChannel();
                  setupPresenceChannel();
                }
              }, delay);
            } 
            else if (connectionAttemptsRef.current >= maxRetries) {
              console.error("Presence 최대 재시도 횟수에 도달했습니다.");
            }
          }
        });
    } catch (error) {
      setPresenceStatus('error');
      console.error("Presence 채널 설정 중 오류:", error);
    }
  }, [nickname, userColor, cleanupPresenceChannel, logChannelStatus]);

  useEffect(() => {
    isCleanedUpRef.current = false;
    
    // presence 채널 설정 (nickname과 userColor가 있을 때만)
    if (nickname && userColor && !presenceInitializedRef.current) {
      setupPresenceChannel();
    }
    
    return () => {
      isCleanedUpRef.current = true;
      cleanupPresenceChannel();
    };
  }, [nickname, userColor, setupPresenceChannel, cleanupPresenceChannel]);

  // Presence 상태 업데이트 - 주기적으로 호출하여 연결 유지 개선
  const updatePresence = useCallback(async () => {
    if (presenceChannelRef.current && presenceInitializedRef.current && !isCleanedUpRef.current) {
      try {
        await presenceChannelRef.current.track({
          nickname,
          color: userColor,
          online_at: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Presence 업데이트 중 오류:", error);
        
        // 업데이트 실패 시 채널이 끊어진 것으로 간주하고 재연결 시도
        if (presenceStatus === 'connected') {
          setPresenceStatus('error');
          cleanupPresenceChannel();
          setupPresenceChannel();
        }
      }
    } else if (!presenceInitializedRef.current && !isCleanedUpRef.current) {
      setupPresenceChannel();
    }
  }, [nickname, userColor, setupPresenceChannel, cleanupPresenceChannel, presenceStatus]);

  // 30초마다 presence 상태 업데이트 (핑 메커니즘)
  useEffect(() => {
    if (presenceStatus === 'connected') {
      const intervalId = setInterval(() => {
        updatePresence();
      }, 30000);
      
      return () => clearInterval(intervalId);
    }
  }, [updatePresence, presenceStatus]);

  // 수동 재연결 함수
  const reconnect = useCallback(() => {
    cleanupPresenceChannel();
    connectionAttemptsRef.current = 0;
    setupPresenceChannel();
  }, [cleanupPresenceChannel, setupPresenceChannel]);

  return {
    activeUsers,
    activeUsersCount: activeUsers.length,
    updatePresence,
    presenceStatus,
    reconnect
  };
}
