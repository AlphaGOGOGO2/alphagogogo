
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserPresence } from "@/types/chat";
import { toast } from "sonner";
import { checkChannelHealth } from "@/services/chatService";

// 최적화된 설정 상수
const PRESENCE_CONFIG = {
  MAX_RETRIES: 15,               // 최대 재시도 횟수
  BASE_DELAY: 800,               // 기본 지연 시간 최적화
  RECONNECT_COOLDOWN: 5000,      // 5초로 증가 (기존 3초)
  HEARTBEAT_INTERVAL: 30000,     // 하트비트 간격 30초 (최적화)
  MAX_BACKOFF_DELAY: 15000,      // 최대 백오프 지연시간
  PRESENCE_TRACK_INTERVAL: 25000 // 프레즌스 상태 업데이트 간격
};

export function usePresence(nickname: string, userColor: string) {
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
  const [presenceStatus, setPresenceStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const presenceChannelRef = useRef<any>(null);
  const presenceInitializedRef = useRef(false);
  const isCleanedUpRef = useRef(false);
  const connectionAttemptsRef = useRef(0);
  const lastReconnectTimeRef = useRef<number>(0);
  const heartbeatIntervalRef = useRef<number | null>(null);
  const lastHealthCheckRef = useRef<number>(Date.now());
  const healthCheckFailuresRef = useRef(0);
  const channelNameRef = useRef<string>('');

  // 재연결 지연 시간 계산 함수 개선 (지수 백오프)
  const getBackoffDelay = useCallback(() => {
    const attempt = Math.min(connectionAttemptsRef.current, 10); // 최대 10번째 시도까지만 지수 증가
    // 지수 백오프 + 약간의 무작위성 추가 (Jitter)
    const jitter = Math.random() * 300;
    return Math.min(
      PRESENCE_CONFIG.BASE_DELAY * Math.pow(1.7, attempt) + jitter,
      PRESENCE_CONFIG.MAX_BACKOFF_DELAY
    );
  }, []);

  // 이전 닉네임 저장 (변경 감지용)
  const previousNicknameRef = useRef<string>(nickname);

  // 채널 상태 확인 함수 추가
  const checkChannelStatus = useCallback(async () => {
    if (presenceChannelRef.current && presenceStatus === 'connected') {
      const now = Date.now();
      
      // 마지막 상태 확인 후 일정 시간이 지났으면 검사
      if (now - lastHealthCheckRef.current > PRESENCE_CONFIG.HEARTBEAT_INTERVAL) {
        lastHealthCheckRef.current = now;
        
        const isHealthy = await checkChannelHealth();
        
        if (!isHealthy) {
          healthCheckFailuresRef.current++;
          console.warn(`프레즌스 채널 상태 확인 실패 (${healthCheckFailuresRef.current}번째)`);
          
          // 연속 3번 이상 실패하면 연결 재설정
          if (healthCheckFailuresRef.current >= 3) {
            console.error("연속된 프레즌스 채널 상태 확인 실패로 재연결합니다.");
            setPresenceStatus('error');
            reconnect();
            return;
          }
        } else {
          // 상태가 정상이면 실패 카운트 리셋
          healthCheckFailuresRef.current = 0;
        }
      }
    }
  }, [presenceStatus]);

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
        channelNameRef.current = '';
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
    console.log(`Presence 채널 상태: ${status} (시도: ${connectionAttemptsRef.current}/${PRESENCE_CONFIG.MAX_RETRIES})`);
  }, []);

  // 개선된 Presence 채널 설정
  const setupPresenceChannel = useCallback(() => {
    // 이미 채널이 있거나 정리되었거나 필수 데이터가 없으면 설정 중단
    if (presenceChannelRef.current !== null || isCleanedUpRef.current || !nickname || !userColor) {
      return;
    }

    const now = Date.now();
    // 재연결 쿨다운 검사
    if (now - lastReconnectTimeRef.current < PRESENCE_CONFIG.RECONNECT_COOLDOWN && connectionAttemptsRef.current > 0) {
      console.log(`Presence 재연결 쿨다운 대기 중... (${PRESENCE_CONFIG.RECONNECT_COOLDOWN - (now - lastReconnectTimeRef.current)}ms 남음)`);
      setTimeout(setupPresenceChannel, PRESENCE_CONFIG.RECONNECT_COOLDOWN - (now - lastReconnectTimeRef.current));
      return;
    }
    
    lastReconnectTimeRef.current = now;

    try {
      console.log(`사용자를 위한 presence 채널 설정: ${nickname}`);
      setPresenceStatus('connecting');
      connectionAttemptsRef.current += 1;
      
      // 타임스탬프로 고유한 채널 이름 생성 (캐싱 방지)
      const channelName = `presence:${Date.now()}`;
      channelNameRef.current = channelName;
      
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
            
            // 중복 사용자 필터링 (닉네임 기준) 및 최근 활동 시간 기준으로 정렬
            const uniqueUsers = users
              .filter((user, index, self) => 
                index === self.findIndex(u => u.nickname === user.nickname)
              )
              .sort((a, b) => 
                new Date(b.online_at).getTime() - new Date(a.online_at).getTime()
              );
            
            setActiveUsers(uniqueUsers);
          } catch (error) {
            console.error("Presence 상태 처리 중 오류:", error);
          }
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('사용자 참가:', key, newPresences);
          lastHealthCheckRef.current = Date.now(); // 활동 감지됨
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('사용자 퇴장:', key, leftPresences);
          lastHealthCheckRef.current = Date.now(); // 활동 감지됨
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
              healthCheckFailuresRef.current = 0;
              lastHealthCheckRef.current = Date.now();
              setPresenceStatus('connected');
              
              // 하트비트 설정 (연결 유지를 위한 주기적 presence 업데이트)
              if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
              }
              
              heartbeatIntervalRef.current = window.setInterval(() => {
                updatePresence().catch(err => {
                  console.error("Presence 하트비트 실패:", err);
                  healthCheckFailuresRef.current++;
                  
                  if (healthCheckFailuresRef.current >= 3) {
                    console.error("연속된 프레즌스 하트비트 실패로 재연결합니다.");
                    setPresenceStatus('error');
                    reconnect();
                  }
                });
              }, PRESENCE_CONFIG.PRESENCE_TRACK_INTERVAL) as unknown as number;
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
            
            if (status !== 'CLOSED' && connectionAttemptsRef.current < PRESENCE_CONFIG.MAX_RETRIES) {
              const delay = getBackoffDelay();
              console.log(`Presence 재연결 시도 ${connectionAttemptsRef.current}/${PRESENCE_CONFIG.MAX_RETRIES}, ${delay}ms 후...`);
              
              setTimeout(() => {
                if (!isCleanedUpRef.current) {
                  cleanupPresenceChannel();
                  setupPresenceChannel();
                }
              }, delay);
            } 
            else if (connectionAttemptsRef.current >= PRESENCE_CONFIG.MAX_RETRIES) {
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
        lastHealthCheckRef.current = Date.now(); // 업데이트 성공 시 상태 확인 시간 갱신
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

  // 수동 재연결 함수 개선
  const reconnect = useCallback(() => {
    cleanupPresenceChannel();
    connectionAttemptsRef.current = 0;
    healthCheckFailuresRef.current = 0;
    lastHealthCheckRef.current = Date.now();
    setTimeout(setupPresenceChannel, 800); // 약간의 지연 후 재연결
  }, [cleanupPresenceChannel, setupPresenceChannel]);

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
    activeUsers,
    activeUsersCount: activeUsers.length,
    updatePresence,
    presenceStatus,
    reconnect,
    getChannelInfo
  };
}
