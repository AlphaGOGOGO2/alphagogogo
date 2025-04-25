
import { useState, useEffect, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { containsForbiddenWords } from "@/utils/chatFilterUtils";
import { fetchRecentMessages, sendChatMessage } from "@/services/chatService";
import { useMessageSubscription } from "@/hooks/useMessageSubscription";
import { usePresence } from "@/hooks/usePresence";
import { ChatMessage } from "@/types/chat";
import { toast } from "sonner";

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export function useCommunityChat() {
  const [isLoading, setIsLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const [userColor, setUserColor] = useState("");
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting');
  const messagesLoadedRef = useRef(false);
  const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);

  // Initialize user data only once
  useEffect(() => {
    const initUserData = () => {
      const savedNickname = localStorage.getItem('chat_nickname');
      const savedColor = localStorage.getItem('chat_color');
      
      if (savedNickname) {
        setNickname(savedNickname);
      } else {
        const randomNickname = `익명${Math.floor(Math.random() * 10000)}`;
        setNickname(randomNickname);
        localStorage.setItem('chat_nickname', randomNickname);
      }
      
      if (savedColor) {
        setUserColor(savedColor);
      } else {
        const hue = Math.floor(Math.random() * 360);
        const pastelColor = `hsl(${hue}, 70%, 80%)`;
        setUserColor(pastelColor);
        localStorage.setItem('chat_color', pastelColor);
      }
    };
    
    initUserData();
  }, []);
  
  // Load messages on initial mount
  useEffect(() => {
    if (!messagesLoadedRef.current) {
      loadRecentMessages();
      messagesLoadedRef.current = true;
    }
  }, []);

  const loadRecentMessages = async () => {
    setIsLoading(true);
    setConnectionState('connecting');
    try {
      console.log("Loading recent messages from Supabase");
      const data = await fetchRecentMessages();
      
      if (data && data.length > 0) {
        console.log(`Successfully loaded ${data.length} messages`);
        setInitialMessages(data);
        setConnectionState('connected');
      } else {
        console.log("No messages found or empty response");
        setConnectionState('connected'); // 메시지가 없어도 연결은 성공한 것으로 간주
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error("메시지 로딩 실패: 최근 메시지를 불러오는데 실패했습니다.");
      setConnectionState('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Setup message subscription with initial messages
  const { messages } = useMessageSubscription(initialMessages);

  // Setup presence
  const { activeUsers, activeUsersCount, updatePresence } = usePresence(nickname, userColor);

  useEffect(() => {
    // Check if we have active users as an indicator of successful connection
    if (activeUsersCount > 0 && connectionState === 'connecting') {
      setConnectionState('connected');
    }
  }, [activeUsersCount, connectionState]);

  const sendMessage = useCallback(async (messageContent: string) => {
    // Check for forbidden words
    if (containsForbiddenWords(messageContent)) {
      toast.error("부적절한 내용 감지: 욕설이나 선정적인 표현이 포함된 메시지는 전송할 수 없습니다.");
      return;
    }

    if (connectionState !== 'connected') {
      toast.error("채팅 연결이 불안정합니다. 페이지를 새로고침 후 다시 시도해주세요.");
      return;
    }

    const messageId = uuidv4();
    console.log("Sending message:", { messageId, nickname, messageContent });
    
    try {
      const success = await sendChatMessage(messageId, nickname, messageContent, userColor);
      
      if (!success) {
        console.error("Failed to send message");
        toast.error("메시지 전송에 실패했습니다. 다시 시도해주세요.");
      } else {
        console.log("Message sent successfully");
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("메시지 전송 실패: 메시지를 전송하는데 실패했습니다. 다시 시도해주세요.");
    }
  }, [nickname, userColor, connectionState]);

  const changeNickname = useCallback(() => {
    const newNickname = prompt("새로운 닉네임을 입력하세요:", nickname);
    if (newNickname && newNickname.trim()) {
      setNickname(newNickname.trim());
      localStorage.setItem('chat_nickname', newNickname.trim());
      
      // Update presence with new nickname
      updatePresence();
      
      toast.success(`닉네임이 ${newNickname.trim()}(으)로 변경되었습니다.`);
    }
  }, [nickname, updatePresence]);

  const reconnect = useCallback(() => {
    setConnectionState('connecting');
    messagesLoadedRef.current = false;
    loadRecentMessages();
  }, []);

  return {
    messages,
    isLoading,
    nickname,
    userColor,
    sendMessage,
    changeNickname,
    activeUsers,
    activeUsersCount,
    connectionState,
    reconnect
  };
}
