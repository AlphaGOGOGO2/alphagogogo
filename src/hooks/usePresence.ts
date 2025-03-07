
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserPresence } from "@/types/chat";

export function usePresence(nickname: string, userColor: string) {
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
  const presenceChannelRef = useRef<any>(null);

  // Setup presence channel
  const setupPresenceChannel = useCallback(() => {
    if (presenceChannelRef.current !== null) return;

    presenceChannelRef.current = supabase.channel('room:community', {
      config: {
        presence: {
          key: nickname,
        },
      },
    });

    presenceChannelRef.current
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannelRef.current.presenceState();
        const users: UserPresence[] = [];
        
        Object.keys(state).forEach(key => {
          state[key].forEach((presence: UserPresence) => {
            users.push(presence);
          });
        });
        
        setActiveUsers(users);
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          // Send presence data when successfully subscribed
          await presenceChannelRef.current.track({
            nickname: nickname,
            color: userColor,
            online_at: new Date().toISOString(),
          });
        }
      });
  }, [nickname, userColor]);

  // Cleanup presence channel
  const cleanupPresenceChannel = useCallback(() => {
    if (presenceChannelRef.current) {
      supabase.removeChannel(presenceChannelRef.current);
      presenceChannelRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!nickname || !userColor) return;
    
    setupPresenceChannel();
    
    return () => {
      cleanupPresenceChannel();
    };
  }, [nickname, userColor, setupPresenceChannel, cleanupPresenceChannel]);

  const updatePresence = useCallback(async () => {
    if (presenceChannelRef.current) {
      await presenceChannelRef.current.track({
        nickname,
        color: userColor,
        online_at: new Date().toISOString(),
      });
    }
  }, [nickname, userColor]);

  return {
    activeUsers,
    activeUsersCount: activeUsers.length,
    updatePresence
  };
}
