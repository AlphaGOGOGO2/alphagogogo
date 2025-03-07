
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { containsForbiddenWords, censorMessage } from "@/utils/chatFilterUtils";

interface ChatMessage {
  id: string;
  nickname: string;
  content: string;
  created_at: string;
  color: string;
}

export function useCommunityChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nickname, setNickname] = useState("");
  const [userColor, setUserColor] = useState("");
  const { toast } = useToast();
  const channelRef = useRef<any>(null);

  // Generate random nickname and color when hook is initialized
  useEffect(() => {
    const randomNickname = `익명${Math.floor(Math.random() * 10000)}`;
    setNickname(randomNickname);
    
    // Generate a random pastel color
    const hue = Math.floor(Math.random() * 360);
    const pastelColor = `hsl(${hue}, 70%, 80%)`;
    setUserColor(pastelColor);
    
    // Load recent messages
    loadRecentMessages();
    
    // Subscribe to new messages - Only initialize subscription once
    const setupSubscription = () => {
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
    
    setupSubscription();
      
    return () => {
      // Clean up subscription when component unmounts
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

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

  const sendMessage = async (messageContent: string) => {
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
    const tempMessage: ChatMessage = {
      id: messageId,
      nickname,
      content: messageContent,
      created_at: new Date().toISOString(),
      color: userColor
    };
    
    // Optimistically add message to UI
    setMessages(prev => [...prev, tempMessage]);
    
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
      
      // Remove the optimistically added message
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    }
  };

  const changeNickname = () => {
    const newNickname = prompt("새로운 닉네임을 입력하세요:", nickname);
    if (newNickname && newNickname.trim()) {
      setNickname(newNickname.trim());
      toast({
        title: "닉네임 변경 완료",
        description: `닉네임이 ${newNickname.trim()}(으)로 변경되었습니다.`
      });
    }
  };

  return {
    messages,
    isLoading,
    nickname,
    userColor,
    sendMessage,
    changeNickname
  };
}
