
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/chat";
import { toast } from "sonner";

export function useMessageSubscription(initialMessages: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const channelRef = useRef<any>(null);
  const isCleanedUpRef = useRef(false);

  // Update messages when initialMessages changes
  useEffect(() => {
    if (initialMessages.length > 0) {
      console.log("Updating messages with initialMessages:", initialMessages.length);
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  // Setup subscription
  useEffect(() => {
    isCleanedUpRef.current = false;
    
    // Only set up subscription if one doesn't exist already
    if (channelRef.current === null) {
      setupMessageSubscription();
    }
    
    return () => {
      isCleanedUpRef.current = true;
      cleanupChannel();
    };
  }, []);

  const setupMessageSubscription = () => {
    try {
      console.log("Setting up real-time message subscription");
      
      // Create and subscribe to the channel
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
            
            console.log("Received new message from Supabase:", payload);
            const newMsg = payload.new as ChatMessage;
            
            // Add message to state if it doesn't already exist
            setMessages(prev => {
              if (prev.some(msg => msg.id === newMsg.id)) {
                return prev;
              }
              return [...prev, newMsg];
            });
          })
        .subscribe((status) => {
          console.log(`Real-time subscription status: ${status}`);
          if (status === 'SUBSCRIBED') {
            toast.success("실시간 채팅에 연결되었습니다");
          } else if (status === 'CHANNEL_ERROR') {
            toast.error("실시간 채팅 연결에 실패했습니다");
          }
        });
    } catch (error) {
      console.error("Error setting up message subscription:", error);
      toast.error("실시간 채팅 연결에 실패했습니다");
    }
  };

  const cleanupChannel = () => {
    if (channelRef.current) {
      try {
        console.log("Cleaning up message subscription channel");
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
