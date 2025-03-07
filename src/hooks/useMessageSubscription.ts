
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/chat";

export function useMessageSubscription(initialMessages: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const channelRef = useRef<any>(null);
  const initialMessagesRef = useRef<ChatMessage[]>([]);
  const isCleanedUpRef = useRef(false);

  // Setup subscription only once when component mounts
  useEffect(() => {
    isCleanedUpRef.current = false;
    setupMessageSubscription();
    
    return () => {
      isCleanedUpRef.current = true;
      cleanupChannel();
    };
  }, []);

  // Update messages state when initialMessages changes, but avoid continuous re-renders
  useEffect(() => {
    // Only update if initialMessages changed and is not empty
    if (initialMessages.length > 0 && 
        JSON.stringify(initialMessagesRef.current) !== JSON.stringify(initialMessages)) {
      initialMessagesRef.current = initialMessages;
      if (!isCleanedUpRef.current) {
        setMessages(initialMessages);
      }
    }
  }, [initialMessages]);

  const setupMessageSubscription = () => {
    if (channelRef.current !== null || isCleanedUpRef.current) return; // Don't set up another subscription if one exists or cleaned up

    try {
      channelRef.current = supabase
        .channel('public:community_messages')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'community_messages' 
          }, 
          (payload) => {
            if (isCleanedUpRef.current) return;
            const newMsg = payload.new as ChatMessage;
            setMessages(prev => {
              // Check if message already exists to prevent duplicates
              if (prev.some(msg => msg.id === newMsg.id)) {
                return prev;
              }
              return [...prev, newMsg];
            });
          })
        .subscribe((status) => {
          console.log(`Message subscription status: ${status}`);
        });
    } catch (error) {
      console.error("Error setting up message subscription:", error);
    }
  };

  const cleanupChannel = () => {
    if (channelRef.current) {
      try {
        supabase.removeChannel(channelRef.current);
      } catch (error) {
        console.error("Error removing channel:", error);
      } finally {
        channelRef.current = null;
      }
    }
  };

  return { messages, setMessages };
}
