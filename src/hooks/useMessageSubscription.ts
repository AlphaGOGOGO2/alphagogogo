
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/chat";

export function useMessageSubscription(initialMessages: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const channelRef = useRef<any>(null);
  const initialMessagesRef = useRef<ChatMessage[]>([]);

  // Setup subscription only once when component mounts
  useEffect(() => {
    setupMessageSubscription();
    
    return () => {
      cleanupChannel();
    };
  }, []);

  // Update messages state when initialMessages changes, but avoid continuous re-renders
  useEffect(() => {
    // Only update if initialMessages changed and is not empty
    if (initialMessages.length > 0 && 
        JSON.stringify(initialMessagesRef.current) !== JSON.stringify(initialMessages)) {
      initialMessagesRef.current = initialMessages;
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
