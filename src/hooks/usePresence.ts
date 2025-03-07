
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserPresence } from "@/types/chat";

export function usePresence(nickname: string, userColor: string) {
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
  const presenceChannelRef = useRef<any>(null);
  const presenceInitializedRef = useRef(false);
  const isCleanedUpRef = useRef(false);

  // Setup presence channel
  const setupPresenceChannel = useCallback(() => {
    if (presenceChannelRef.current !== null || isCleanedUpRef.current || !nickname || !userColor) return;

    try {
      presenceChannelRef.current = supabase.channel('room:community', {
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
          if (status === 'SUBSCRIBED' && !isCleanedUpRef.current) {
            // Send presence data when successfully subscribed
            try {
              await presenceChannelRef.current.track({
                nickname: nickname,
                color: userColor,
                online_at: new Date().toISOString(),
              });
              presenceInitializedRef.current = true;
            } catch (error) {
              console.error("Error tracking presence:", error);
            }
          }
        });
    } catch (error) {
      console.error("Error setting up presence channel:", error);
    }
  }, [nickname, userColor]);

  // Cleanup presence channel
  const cleanupPresenceChannel = useCallback(() => {
    if (presenceChannelRef.current) {
      try {
        supabase.removeChannel(presenceChannelRef.current);
      } catch (error) {
        console.error("Error removing presence channel:", error);
      } finally {
        presenceChannelRef.current = null;
        presenceInitializedRef.current = false;
      }
    }
  }, []);

  useEffect(() => {
    isCleanedUpRef.current = false;
    
    if (!nickname || !userColor) return;
    
    // Setup presence channel only if not already initialized
    if (!presenceInitializedRef.current) {
      setupPresenceChannel();
    } else if (presenceChannelRef.current) {
      // Just update presence data if channel is already set up
      updatePresence();
    }
    
    return () => {
      isCleanedUpRef.current = true;
      cleanupPresenceChannel();
    };
  }, [nickname, userColor, setupPresenceChannel, cleanupPresenceChannel]);

  const updatePresence = useCallback(async () => {
    if (presenceChannelRef.current && !isCleanedUpRef.current) {
      try {
        await presenceChannelRef.current.track({
          nickname,
          color: userColor,
          online_at: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error updating presence:", error);
      }
    }
  }, [nickname, userColor]);

  return {
    activeUsers,
    activeUsersCount: activeUsers.length,
    updatePresence
  };
}
