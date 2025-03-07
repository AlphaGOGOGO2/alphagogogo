
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/chat";

export function useMessageSubscription(initialMessages: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    setupMessageSubscription();
    
    return () => {
      cleanupChannel();
    };
  }, []);

  useEffect(() => {
    // Update messages state when initialMessages changes
    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  const setupMessageSubscription = () => {
    if (channelRef.current !== null) return; // Don't set up another subscription if one exists

    channelRef.current = supabase
      .channel('public:community_messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'community_messages' 
        }, 
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages(prev => {
            // Check if message already exists to prevent duplicates
            if (prev.some(msg => msg.id === newMsg.id)) {
              return prev;
            }
            return [...prev, newMsg];
          });
        })
      .subscribe();
  };

  const cleanupChannel = () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  };

  return { messages, setMessages };
}
