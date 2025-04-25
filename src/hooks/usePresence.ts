
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
  const maxRetries = 5;
  const baseDelay = 2000;

  const getBackoffDelay = () => {
    return Math.min(baseDelay * Math.pow(2, connectionAttemptsRef.current), 30000);
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

  // Setup presence channel
  const setupPresenceChannel = useCallback(() => {
    if (presenceChannelRef.current !== null || isCleanedUpRef.current || !nickname || !userColor) return;

    try {
      console.log("Setting up presence channel for user:", nickname);
      setPresenceStatus('connecting');
      connectionAttemptsRef.current += 1;
      
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
          } else if (status === 'CHANNEL_ERROR') {
            setPresenceStatus('error');
            
            if (connectionAttemptsRef.current < maxRetries) {
              console.log(`재연결 시도 ${connectionAttemptsRef.current}/${maxRetries}...`);
              const timeout = setTimeout(() => {
                if (!isCleanedUpRef.current) {
                  cleanupPresenceChannel();
                  setupPresenceChannel();
                }
              }, getBackoffDelay());
              
              return () => clearTimeout(timeout);
            }
          } else if (status === 'TIMED_OUT') {
            setPresenceStatus('error');
            if (connectionAttemptsRef.current < maxRetries) {
              const timeout = setTimeout(() => {
                if (!isCleanedUpRef.current) {
                  cleanupPresenceChannel();
                  setupPresenceChannel();
                }
              }, getBackoffDelay());
              
              return () => clearTimeout(timeout);
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
    
    if (!presenceInitializedRef.current) {
      setupPresenceChannel();
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
