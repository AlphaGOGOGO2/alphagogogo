
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { containsForbiddenWords } from "@/utils/chatFilterUtils";

interface ChatMessage {
  id: string;
  nickname: string;
  content: string;
  created_at: string;
  color: string;
}

interface UserPresence {
  nickname: string;
  color: string;
  online_at: string;
}

export function useCommunityChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const [userColor, setUserColor] = useState("");
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
  const { toast } = useToast();
  const channelRef = useRef<any>(null);
  const presenceChannelRef = useRef<any>(null);
  const messagesLoaded = useRef(false);

  // Generate random nickname and color only once when hook is initialized
  useEffect(() => {
    const randomNickname = `익명${Math.floor(Math.random() * 10000)}`;
    setNickname(randomNickname);
    
    // Generate a random pastel color
    const hue = Math.floor(Math.random() * 360);
    const pastelColor = `hsl(${hue}, 70%, 80%)`;
    setUserColor(pastelColor);
  }, []);
  
  // Load messages only once
  useEffect(() => {
    if (!messagesLoaded.current) {
      loadRecentMessages();
      messagesLoaded.current = true;
    }
  }, []);
  
  // Set up subscriptions
  useEffect(() => {
    if (!nickname || !userColor) return;
    
    // Only initialize subscription once
    setupMessageSubscription();
    setupPresenceChannel();
    
    return () => {
      // Clean up subscriptions when component unmounts
      cleanupChannels();
    };
  }, [nickname, userColor]);

  const cleanupChannels = () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (presenceChannelRef.current) {
      supabase.removeChannel(presenceChannelRef.current);
      presenceChannelRef.current = null;
    }
  };

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
  
  const setupPresenceChannel = () => {
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
  };

  const loadRecentMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('community_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50) as { data: ChatMessage[] | null, error: any };
        
      if (error) throw error;
      
      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "메시지 로딩 실패",
        description: "최근 메시지를 불러오는데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = useCallback(async (messageContent: string) => {
    // 금지된 단어 확인
    if (containsForbiddenWords(messageContent)) {
      toast({
        title: "부적절한 내용 감지",
        description: "욕설이나 선정적인 표현이 포함된 메시지는 전송할 수 없습니다.",
        variant: "destructive"
      });
      return;
    }

    const messageId = uuidv4();
    const timestamp = new Date().toISOString();
    
    const tempMessage: ChatMessage = {
      id: messageId,
      nickname,
      content: messageContent,
      created_at: timestamp,
      color: userColor
    };
    
    try {
      const { error } = await supabase
        .from('community_messages')
        .insert({
          id: messageId,
          nickname,
          content: messageContent,
          color: userColor
        } as any);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "메시지 전송 실패",
        description: "메시지를 전송하는데 실패했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    }
  }, [nickname, userColor, toast]);

  const changeNickname = useCallback(() => {
    const newNickname = prompt("새로운 닉네임을 입력하세요:", nickname);
    if (newNickname && newNickname.trim()) {
      setNickname(newNickname.trim());
      
      // Update presence with new nickname
      if (presenceChannelRef.current) {
        presenceChannelRef.current.track({
          nickname: newNickname.trim(),
          color: userColor,
          online_at: new Date().toISOString(),
        });
      }
      
      toast({
        title: "닉네임 변경 완료",
        description: `닉네임이 ${newNickname.trim()}(으)로 변경되었습니다.`
      });
    }
  }, [nickname, userColor, toast]);

  return {
    messages,
    isLoading,
    nickname,
    userColor,
    sendMessage,
    changeNickname,
    activeUsers,
    activeUsersCount: activeUsers.length
  };
}
