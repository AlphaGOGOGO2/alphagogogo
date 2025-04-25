
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
  const maxRetries = 15;
  const baseDelay = 800;
  const lastReconnectTimeRef = useRef<number>(0);
  const reconnectCooldown = 3000;
  const heartbeatIntervalRef = useRef<number | null>(null);

  // 재연결 지연 시간 계산 함수 개선
  const getBackoffDelay = useCallback(() => {
    const attempt = Math.min(connectionAttemptsRef.current, 10); // 최대 10번째 시도까지만 지수 증가
    // 지수 백오프 + 약간의 무작위성 추가 (Jitter)
    const jitter = Math.random() * 300;
    return Math.min(baseDelay * Math.pow(1.5, attempt) + jitter, 12000);
  }, []);

  // 이전 닉네임 저장 (변경 감지용)
  const previousNicknameRef = useRef<string>(nickname);

  // Presence 채널 정리
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
    
    // 하트비트 인터벌 정리
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  // 로그 채널 상태
  const logChannelStatus = useCallback((status: string) => {
    console.log(`Presence 채널 상태: ${status} (시도: ${connectionAttemptsRef.current}/${maxRetries})`);
  }, []);

  // 개선된 Presence 채널 설정
  const setupPresenceChannel = useCallback(() => {
    // 이미 채널이 있거나 정리되었거나 필수 데이터가 없으면 설정 중단
    if (presenceChannelRef.current !== null || isCleanedUpRef.current || !nickname || !userColor) {
      return;
    }

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
      const channelName = `presence:${Date.now()}`;
      
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
              if (state[key] && Array.isArray(state[key])) {
                state[key].forEach((presence: UserPresence) => {
                  if (presence && presence.nickname) {
                    users.push(presence);
                  }
                });
              }
            });
            
            // 중복 사용자 필터링 (닉네임 기준)
            const uniqueUsers = users.filter((user, index, self) => 
              index === self.findIndex(u => u.nickname === user.nickname)
            );
            
            setActiveUsers(uniqueUsers);
          } catch (error) {
            console.error("Presence 상태 처리 중 오류:", error);
          }
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('사용자 참가:', key, newPresences);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('사용자 퇴장:', key, leftPresences);
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
              
              // 하트비트 설정 (연결 유지를 위한 주기적 presence 업데이트)
              if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
              }
              
              heartbeatIntervalRef.current = window.setInterval(() => {
                updatePresence().catch(err => {
                  console.error("Presence 하트비트 실패:", err);
                  setPresenceStatus('error');
                });
              }, 25000) as unknown as number; // 25초마다 하트비트
            } catch (error) {
              console.error("Presence 추적 중 오류:", error);
              setPresenceStatus('error');
            }
          } 
          else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            console.error(`Presence 채널 상태 오류: ${status}`);
            setPresenceStatus('error');
            
            // 하트비트 인터벌 정리
            if (heartbeatIntervalRef.current) {
              clearInterval(heartbeatIntervalRef.current);
              heartbeatIntervalRef.current = null;
            }
            
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
              // 사용자 경험상 presence 오류는 토스트를 표시하지 않음 (핵심 기능은 아니므로)
            }
          }
        });
    } catch (error) {
      setPresenceStatus('error');
      console.error("Presence 채널 설정 중 오류:", error);
    }
  }, [nickname, userColor, cleanupPresenceChannel, logChannelStatus, getBackoffDelay]);

  // 닉네임 변경 감지
  useEffect(() => {
    // 닉네임이 변경되었고 이전에 초기화된 채널이 있으면 재설정
    if (nickname !== previousNicknameRef.current && presenceInitializedRef.current) {
      console.log(`닉네임이 변경되었습니다: ${previousNicknameRef.current} -> ${nickname}`);
      previousNicknameRef.current = nickname;
      
      cleanupPresenceChannel();
      setupPresenceChannel();
    } else {
      previousNicknameRef.current = nickname;
    }
  }, [nickname, cleanupPresenceChannel, setupPresenceChannel]);

  useEffect(() => {
    isCleanedUpRef.current = false;
    
    // presence 채널 설정 (nickname과 userColor가 있을 때만)
    if (nickname && userColor) {
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
        return true;
      } catch (error) {
        console.error("Presence 업데이트 중 오류:", error);
        
        // 업데이트 실패 시 채널이 끊어진 것으로 간주하고 재연결 시도
        if (presenceStatus === 'connected') {
          setPresenceStatus('error');
          cleanupPresenceChannel();
          setupPresenceChannel();
        }
        return false;
      }
    } else if (!presenceInitializedRef.current && !isCleanedUpRef.current && nickname && userColor) {
      setupPresenceChannel();
      return false;
    }
    return false;
  }, [nickname, userColor, setupPresenceChannel, cleanupPresenceChannel, presenceStatus]);

  // 수동 재연결 함수
  const reconnect = useCallback(() => {
    cleanupPresenceChannel();
    connectionAttemptsRef.current = 0;
    setTimeout(setupPresenceChannel, 500); // 약간의 지연 후 재연결
  }, [cleanupPresenceChannel, setupPresenceChannel]);

  return {
    activeUsers,
    activeUsersCount: activeUsers.length,
    updatePresence,
    presenceStatus,
    reconnect
  };
}
