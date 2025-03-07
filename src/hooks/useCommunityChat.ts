
import { useState, useEffect, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { containsForbiddenWords } from "@/utils/chatFilterUtils";
import { fetchRecentMessages, sendChatMessage } from "@/services/chatService";
import { useMessageSubscription } from "@/hooks/useMessageSubscription";
import { usePresence } from "@/hooks/usePresence";
import { ChatMessage } from "@/types/chat";

export function useCommunityChat() {
  const [isLoading, setIsLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const [userColor, setUserColor] = useState("");
  const { toast } = useToast();
  const messagesLoaded = useRef(false);

  // Initialize user data
  useEffect(() => {
    const randomNickname = `익명${Math.floor(Math.random() * 10000)}`;
    setNickname(randomNickname);
    
    // Generate a random pastel color
    const hue = Math.floor(Math.random() * 360);
    const pastelColor = `hsl(${hue}, 70%, 80%)`;
    setUserColor(pastelColor);
  }, []);
  
  // Load messages
  useEffect(() => {
    if (!messagesLoaded.current) {
      loadRecentMessages();
      messagesLoaded.current = true;
    }
  }, []);

  const loadRecentMessages = async () => {
    setIsLoading(true);
    try {
      const data = await fetchRecentMessages();
      if (data) {
        setInitialMessages(data);
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

  // Setup message subscription
  const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);
  const { messages } = useMessageSubscription(initialMessages);

  // Setup presence
  const { activeUsers, activeUsersCount, updatePresence } = usePresence(nickname, userColor);

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
    
    try {
      await sendChatMessage(messageId, nickname, messageContent, userColor);
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
      updatePresence();
      
      toast({
        title: "닉네임 변경 완료",
        description: `닉네임이 ${newNickname.trim()}(으)로 변경되었습니다.`
      });
    }
  }, [nickname, updatePresence, toast]);

  return {
    messages,
    isLoading,
    nickname,
    userColor,
    sendMessage,
    changeNickname,
    activeUsers,
    activeUsersCount
  };
}
