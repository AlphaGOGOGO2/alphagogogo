
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
  const maxRetries = 7;
  const baseDelay = 1500;

  const getBackoffDelay = () => {
    // 지수 백오프 + 약간의 무작위성 추가 (Jitter)
    const jitter = Math.random() * 500;
    return Math.min(baseDelay * Math.pow(1.5, connectionAttemptsRef.current) + jitter, 20000); // 최대 20초
  };

  // Cleanup presence channel
  const cleanupPresenceChannel = useCallback(() => {
    if (presenceChannelRef.current) {
      try {
        console.log("Cleaning up presence channel");
        supabase.removeChannel(presenceChannelRef.current);
      } catch (error) {
        console.error("Error removing presence channel:", error);
      } finally {
        presenceChannelRef.current = null;
        presenceInitializedRef.current = false;
      }
    }
  }, []);

  // 개선된 Presence 채널 설정
  const setupPresenceChannel = useCallback(() => {
    if (presenceChannelRef.current !== null || isCleanedUpRef.current || !nickname || !userColor) return;

    try {
      console.log("Setting up presence channel for user:", nickname);
      setPresenceStatus('connecting');
      connectionAttemptsRef.current += 1;
      
      // 타임스탬프로 고유한 채널 이름 생성 (캐싱 방지)
      const timestamp = Date.now();
      const channelName = `room:community:${timestamp}`;
      
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
            console.error("Error processing presence state:", error);
          }
        })
        .subscribe(async (status: string) => {
          console.log(`Presence channel status: ${status}`);
          
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
              console.error("Error tracking presence:", error);
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
      console.error("Error setting up presence channel:", error);
    }
  }, [nickname, userColor, cleanupPresenceChannel]);

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

  // Presence 상태 업데이트
  const updatePresence = useCallback(async () => {
    if (presenceChannelRef.current && presenceInitializedRef.current && !isCleanedUpRef.current) {
      try {
        await presenceChannelRef.current.track({
          nickname,
          color: userColor,
          online_at: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error updating presence:", error);
      }
    } else if (!presenceInitializedRef.current && !isCleanedUpRef.current) {
      setupPresenceChannel();
    }
  }, [nickname, userColor, setupPresenceChannel]);

  // 재연결 함수
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
