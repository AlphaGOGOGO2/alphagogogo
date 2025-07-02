
import { useState, useEffect, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { containsForbiddenWords } from "@/utils/chatFilterUtils";
import { 
  fetchRecentMessages, 
  sendChatMessage, 
  diagnoseConnection,
  evaluateConnectionQuality 
} from "@/services/chatService";
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
  const [connectionDiagnosis, setConnectionDiagnosis] = useState<string | null>(null);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'acceptable' | 'poor' | 'unknown'>('unknown');
  const messagesLoadedRef = useRef(false);
  const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);
  const lastDiagnosisTimeRef = useRef<number>(0);
  const connectionDiagnosisRunningRef = useRef(false);
  const autoReconnectTimeoutRef = useRef<number | null>(null);
  const diagnosticCheckTimeoutRef = useRef<number | null>(null);

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
    
    // 페이지 가시성 변경 감지 (백그라운드에서 포그라운드로 전환 시 상태 확인)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // 페이지가 다시 보이게 되면 연결 상태 진단
        checkConnectionStatus();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (autoReconnectTimeoutRef.current) {
        clearTimeout(autoReconnectTimeoutRef.current);
      }
      
      if (diagnosticCheckTimeoutRef.current) {
        clearTimeout(diagnosticCheckTimeoutRef.current);
      }
    };
  }, []);
  
  // 연결 품질 주기적 확인
  const checkConnectionStatus = useCallback(async () => {
    // 이미 연결 상태가 에러인 경우에는 진단 실행
    if (connectionState === 'error') {
      await runConnectionDiagnosis();
      return;
    }
    
    try {
      const qualityResult = await evaluateConnectionQuality();
      setConnectionQuality(qualityResult.quality);
      
      // 연결 품질이 좋지 않으면 자동 재연결 시도
      if (qualityResult.quality === 'poor' && connectionState === 'connected') {
        console.warn("연결 품질이 좋지 않아 자동 재연결을 준비합니다.");
        
        // 5초 후 자동 재연결 시도
        if (autoReconnectTimeoutRef.current) {
          clearTimeout(autoReconnectTimeoutRef.current);
        }
        
        autoReconnectTimeoutRef.current = window.setTimeout(() => {
          console.log("연결 품질이 좋지 않아 자동 재연결을 시도합니다.");
          reconnect();
        }, 5000) as unknown as number;
      }
      
      // 일정 시간 후 다시 연결 상태 확인
      if (diagnosticCheckTimeoutRef.current) {
        clearTimeout(diagnosticCheckTimeoutRef.current);
      }
      
      diagnosticCheckTimeoutRef.current = window.setTimeout(() => {
        checkConnectionStatus();
      }, 120000) as unknown as number; // 2분마다 확인
      
    } catch (err) {
      console.error("연결 상태 확인 중 오류 발생:", err);
    }
  }, [connectionState]);
  
  // 초기 로딩 시 메시지 가져오기
  useEffect(() => {
    if (!messagesLoadedRef.current) {
      loadRecentMessages();
    }
    
    // 초기 연결 후 일정 시간 후 연결 품질 확인 시작
    const timer = setTimeout(() => {
      checkConnectionStatus();
    }, 10000); // 10초 후 첫 확인
    
    return () => clearTimeout(timer);
  }, [checkConnectionStatus]);

  // 연결 진단 함수
  const runConnectionDiagnosis = useCallback(async () => {
    if (connectionDiagnosisRunningRef.current) return;
    
    connectionDiagnosisRunningRef.current = true;
    lastDiagnosisTimeRef.current = Date.now();
    
    try {
      const result = await diagnoseConnection();
      setConnectionDiagnosis(`연결 상태: ${
        result.status === 'good' ? '양호' : 
        result.status === 'poor' ? '불안정' : '나쁨'
      }. ${result.details}`);
      
      connectionDiagnosisRunningRef.current = false;
      return result;
    } catch (error) {
      console.error("연결 진단 중 오류:", error);
      setConnectionDiagnosis("연결 진단 중 오류가 발생했습니다.");
      connectionDiagnosisRunningRef.current = false;
      return null;
    }
  }, []);

  const loadRecentMessages = async () => {
    setIsLoading(true);
    setConnectionState('connecting');
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log("Loading recent messages from Supabase");
      }
      const data = await fetchRecentMessages();
      
      if (data && data.length > 0) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Successfully loaded ${data.length} messages`);
        }
        setInitialMessages(data);
        setConnectionState('connected');
        messagesLoadedRef.current = true;
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log("No messages found or empty response");
        }
        setConnectionState('connected'); // 메시지가 없어도 연결은 성공한 것으로 간주
        messagesLoadedRef.current = true;
      }
      
      // 연결 성공 후 연결 품질 확인 시작
      setTimeout(() => {
        checkConnectionStatus();
      }, 5000);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error("메시지 로딩 실패: 최근 메시지를 불러오는데 실패했습니다.");
      setConnectionState('error');
      
      // 자동 연결 진단 실행
      runConnectionDiagnosis();
    } finally {
      setIsLoading(false);
    }
  };

  // 개선된 메시지 구독 설정
  const { 
    messages, 
    subscriptionStatus, 
    reconnect: reconnectMessages, 
    pingServer,
    getChannelInfo: getMessageChannelInfo 
  } = useMessageSubscription(initialMessages);

  // 개선된 프레즌스 설정
  const { 
    activeUsers, 
    activeUsersCount, 
    presenceStatus, 
    reconnect: reconnectPresence,
    getChannelInfo: getPresenceChannelInfo 
  } = usePresence(nickname, userColor);

  // 연결 상태 통합 관리 개선
  useEffect(() => {
    // 메시지 로딩이 완료된 후에만 상태 업데이트
    if (!isLoading) {
      if (subscriptionStatus === 'connected' && presenceStatus === 'connected') {
        setConnectionState('connected');
        
        // 이전 진단 정보 초기화
        if (connectionDiagnosis) {
          setTimeout(() => setConnectionDiagnosis(null), 10000); // 10초 후 진단 정보 숨김
        }
      } else if (subscriptionStatus === 'error' || presenceStatus === 'error') {
        setConnectionState('error');
        
        // 오류 발생 시 자동으로 진단 실행 (아직 실행 중이지 않고, 마지막 진단으로부터 1분 이상 지난 경우에만)
        const now = Date.now();
        if (!connectionDiagnosisRunningRef.current && (now - lastDiagnosisTimeRef.current > 60000)) {
          runConnectionDiagnosis();
        }
      } else if (subscriptionStatus === 'connecting' || presenceStatus === 'connecting') {
        setConnectionState('connecting');
      } else {
        setConnectionState('disconnected');
      }
    }
  }, [subscriptionStatus, presenceStatus, isLoading, runConnectionDiagnosis, connectionDiagnosis]);

  // 연결 상태 진단 실행 함수
  const diagnoseConnectionStatus = useCallback(async () => {
    toast.info("연결 상태 진단 중...");
    const result = await runConnectionDiagnosis();
    
    // Ping 테스트 실행
    const pingTime = await pingServer();
    
    if (pingTime !== null) {
      const qualityText = pingTime < 300 ? '좋음' : pingTime < 1000 ? '보통' : '나쁨';
      
      toast.info(`서버 응답 시간: ${pingTime}ms (${qualityText})`, {
        id: "ping-result",
        duration: 5000
      });
      
      // 채널 정보 로그
      const msgChannelInfo = getMessageChannelInfo();
      const presenceChannelInfo = getPresenceChannelInfo();
      
      console.log("메시지 채널 정보:", msgChannelInfo);
      console.log("프레즌스 채널 정보:", presenceChannelInfo);
    }
    
    return result;
  }, [runConnectionDiagnosis, pingServer, getMessageChannelInfo, getPresenceChannelInfo]);

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
    if (process.env.NODE_ENV === 'development') {
      console.log("Sending message:", { messageId, nickname, messageContent });
    }
    
    try {
      // 낙관적 UI 업데이트는 제거하고 실제 전송 성공 후 서버에서 받은 메시지만 표시
      const success = await sendChatMessage(messageId, nickname, messageContent, userColor);
      
      if (!success) {
        console.error("Failed to send message");
        toast.error("메시지 전송에 실패했습니다. 다시 시도해주세요.");
      }
      // 실시간 구독을 통해 메시지가 자동으로 추가되므로 여기서는 추가하지 않음
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
    
    // 모든 타임아웃 정리
    if (autoReconnectTimeoutRef.current) {
      clearTimeout(autoReconnectTimeoutRef.current);
      autoReconnectTimeoutRef.current = null;
    }
    
    if (diagnosticCheckTimeoutRef.current) {
      clearTimeout(diagnosticCheckTimeoutRef.current);
      diagnosticCheckTimeoutRef.current = null;
    }
    
    // 메시지 로드 상태 초기화
    messagesLoadedRef.current = false;
    
    // 실시간 구독 재설정
    reconnectMessages();
    reconnectPresence();
    
    // 최근 메시지 다시 로드
    loadRecentMessages();
    
    // 진단 정보 초기화
    setConnectionDiagnosis(null);
    setConnectionQuality('unknown');
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
    connectionDiagnosis,
    connectionQuality,
    diagnoseConnectionStatus,
    reconnect
  };
}
