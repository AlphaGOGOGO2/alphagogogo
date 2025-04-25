
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserPresence } from "@/types/chat";

export function usePresence(nickname: string, userColor: string) {
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!nickname || !userColor) return;

    const channel = supabase.channel('presence_users')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users: UserPresence[] = Object.values(state)
          .flat()
          .filter((presence: any): presence is UserPresence => 
            presence && typeof presence === 'object' && 'nickname' in presence
          );
        setActiveUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          await channel.track({
            nickname,
            color: userColor,
            online_at: new Date().toISOString(),
          });
        } else {
          setIsConnected(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [nickname, userColor]);

  return {
    activeUsers,
    activeUsersCount: activeUsers.length,
    isConnected
  };
}
