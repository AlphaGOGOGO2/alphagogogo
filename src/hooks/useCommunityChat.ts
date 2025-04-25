
import { useState, useEffect, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { containsForbiddenWords } from "@/utils/chatFilterUtils";
import { fetchRecentMessages, sendChatMessage, checkChannelHealth } from "@/services/chatService";
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
  const healthCheckIntervalRef = useRef<number | null>(null);
  const lastHealthCheckRef = useRef<number>(0);
  const healthCheckFailuresRef = useRef(0);

  // 사용자 데이터 초기화 (한 번만)
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
  
  // 초기 로딩 시 메시지 가져오기
  useEffect(() => {
    if (!messagesLoadedRef.current) {
      loadRecentMessages();
      messagesLoadedRef.current = true;
    }
  }, []);

  // 채널 건강 상태 확인 함수 - 방어적 접근 개선
  const performHealthCheck = useCallback(async () => {
    // 마지막 건강 확인 이후 최소 10초 지났는지 확인 (너무 자주 확인 방지)
    const now = Date.now();
    if (now - lastHealthCheckRef.current < 10000) {
      return;
    }
    
    lastHealthCheckRef.current = now;
    
    try {
      if (connectionState === 'connected') {
        const isHealthy = await checkChannelHealth();
        
        if (!isHealthy) {
          healthCheckFailuresRef.current++;
          console.warn(`채널 건강 확인 실패: ${healthCheckFailuresRef.current}회`);
          
          // 연속 3번 이상 실패하면 연결 상태 업데이트
          if (healthCheckFailuresRef.current >= 3) {
            setConnectionState('error');
            toast.error("채팅 연결이 끊어졌습니다. 재연결이 필요합니다.", {
              id: "connection-lost"
            });
            healthCheckFailuresRef.current = 0;
          }
        } else {
          // 성공하면 실패 카운트 초기화
          healthCheckFailuresRef.current = 0;
        }
      }
    } catch (error) {
      console.error("건강 확인 중 오류:", error);
    }
  }, [connectionState]);

  // 주기적 채널 건강 상태 확인
  useEffect(() => {
    const startHealthCheck = () => {
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
      }
      
      healthCheckIntervalRef.current = window.setInterval(() => {
        performHealthCheck();
      }, 30000) as unknown as number; // 30초마다 확인
    };
    
    if (connectionState === 'connected') {
      startHealthCheck();
    }
    
    return () => {
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
      }
    };
  }, [connectionState, performHealthCheck]);

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

  // 개선된 메시지 구독 설정
  const { messages, subscriptionStatus, reconnect: reconnectMessages } = useMessageSubscription(initialMessages);

  // 개선된 프레즌스 설정
  const { activeUsers, activeUsersCount, presenceStatus, reconnect: reconnectPresence } = usePresence(nickname, userColor);

  // 연결 상태 통합 관리 개선
  useEffect(() => {
    // 메시지 로딩이 완료된 후에만 상태 업데이트
    if (!isLoading) {
      if (subscriptionStatus === 'connected' && presenceStatus === 'connected') {
        setConnectionState('connected');
      } else if (subscriptionStatus === 'error' || presenceStatus === 'error') {
        setConnectionState('error');
      } else if (subscriptionStatus === 'connecting' || presenceStatus === 'connecting') {
        setConnectionState('connecting');
      } else {
        setConnectionState('disconnected');
      }
    }
  }, [subscriptionStatus, presenceStatus, isLoading]);

  const sendMessage = useCallback(async (messageContent: string) => {
    // 금지어 확인
    if (containsForbiddenWords(messageContent)) {
      toast.error("부적절한 내용 감지: 욕설이나 선정적인 표현이 포함된 메시지는 전송할 수 없습니다.");
      return;
    }

    // 연결 상태 확인
    if (connectionState !== 'connected') {
      toast.error("채팅 연결이 불안정합니다. 재연결 후 다시 시도해주세요.");
      return;
    }

    const messageId = uuidv4();
    console.log("Sending message:", { messageId, nickname, messageContent });
    
    try {
      const success = await sendChatMessage(messageId, nickname, messageContent, userColor);
      
      if (!success) {
        console.error("Failed to send message");
        toast.error("메시지 전송에 실패했습니다. 다시 시도해주세요.");
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
      
      // 닉네임 변경 후 프레즌스 채널 재연결
      reconnectPresence();
      
      toast.success(`닉네임이 ${newNickname.trim()}(으)로 변경되었습니다.`);
    }
  }, [nickname, reconnectPresence]);

  // 개선된 전체 재연결 함수
  const reconnect = useCallback(() => {
    setConnectionState('connecting');
    toast.info("채팅 서버에 재연결 중...");
    
    // 건강 상태 확인 실패 카운터 초기화
    healthCheckFailuresRef.current = 0;
    
    // 메시지 로드 상태 초기화
    messagesLoadedRef.current = false;
    
    // 실시간 구독 재설정
    reconnectMessages();
    reconnectPresence();
    
    // 최근 메시지 다시 로드
    loadRecentMessages();
  }, [reconnectMessages, reconnectPresence]);

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
