
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserPresence } from "@/types/chat";
import { checkChannelHealth } from "@/services/chatService";

export function usePresence(nickname: string, userColor: string) {
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [channelSubscribed, setChannelSubscribed] = useState(false);

  useEffect(() => {
    if (!nickname || !userColor) return;

    let channel: ReturnType<typeof supabase.channel> | null = null;
    
    // 아직 구독하지 않은 경우에만 채널 설정
    if (!channelSubscribed) {
      channel = supabase.channel('presence_users')
        .on('presence', { event: 'sync' }, () => {
          const state = channel?.presenceState();
          if (!state) return;
          
          // 반환되는 데이터 구조가 기대한 형식과 다를 수 있으므로 필터링 및 변환 로직 개선
          const users: UserPresence[] = [];
          
          // 각 키(사용자)에 대해 처리
          Object.keys(state).forEach(key => {
            if (Array.isArray(state[key])) {
              state[key].forEach((presence: any) => {
                // presence 객체에 필요한 필드가 모두 있는지 확인
                if (presence && typeof presence === 'object' && 
                    'nickname' in presence && 
                    'color' in presence && 
                    'online_at' in presence) {
                  users.push({
                    nickname: presence.nickname,
                    color: presence.color,
                    online_at: presence.online_at
                  });
                }
              });
            }
          });
          
          setActiveUsers(users);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
            setChannelSubscribed(true);
            
            if (channel) {
              await channel.track({
                nickname,
                color: userColor,
                online_at: new Date().toISOString(),
              });
            }
          } else {
            setIsConnected(false);
          }
        });
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
        setChannelSubscribed(false);
      }
    };
  }, [nickname, userColor]);

  return {
    activeUsers,
    activeUsersCount: activeUsers.length,
    isConnected
  };
}
