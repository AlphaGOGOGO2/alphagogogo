
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/chat";
import { toast } from "sonner";

// 연결 상태 확인용 타임아웃 값 최적화
const CONNECTION_TIMEOUT = 15000; // 15초로 증가 (기존 10초)
const CONNECTION_CHECK_INTERVAL = 60000; // 60초로 증가 (기존 45초)
const MAX_RETRIES = 5; // 최대 재시도 횟수

export const fetchRecentMessages = async (): Promise<ChatMessage[]> => {
  let retries = 0;
  
  const attemptFetch = async (): Promise<ChatMessage[]> => {
    try {
      console.log("Supabase에서 최근 메시지 가져오는 중");
      
      // 타임아웃 처리 개선
      const timeoutPromise = new Promise<{data: null, error: Error}>((_, reject) => {
        setTimeout(() => reject(new Error("데이터베이스 연결 시간 초과")), CONNECTION_TIMEOUT);
      });
      
      const queryPromise = supabase
        .from('community_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100); // 초기 로드 메시지 수 증가
        
      // Race 조건으로 타임아웃 처리
      const { data, error } = await Promise.race([
        queryPromise,
        timeoutPromise
      ]) as { data: ChatMessage[] | null, error: any };
        
      if (error) {
        console.error("최근 메시지 가져오는 중 오류:", error);
        
        if (retries < MAX_RETRIES) {
          retries++;
          console.log(`재시도 중... (${retries}/${MAX_RETRIES})`);
          // 지수 백오프 적용 (300ms, 600ms, 1200ms, 2400ms, 4800ms)
          const delay = Math.min(300 * Math.pow(2, retries - 1), 5000);
          await new Promise(r => setTimeout(r, delay));
          return attemptFetch();
        }
        
        toast.error("메시지를 불러오는데 실패했습니다. 새로고침 후 다시 시도해주세요.", {
          id: "fetch-messages-error",
          duration: 5000
        });
        throw error;
      }
      
      console.log(`성공적으로 ${data?.length || 0}개의 메시지를 가져왔습니다`);
      return data || [];
    } catch (error) {
      console.error("fetchRecentMessages에서 오류:", error);
      toast.error("메시지를 불러오는데 실패했습니다. 새로고침 후 다시 시도해주세요.", {
        id: "fetch-messages-error",
        duration: 5000
      });
      return [];
    }
  };
  
  return attemptFetch();
};

export const sendChatMessage = async (
  messageId: string,
  nickname: string,
  content: string,
  color: string
): Promise<boolean> => {
  let retries = 0;
  const maxRetries = MAX_RETRIES;
  
  const attemptSend = async (): Promise<boolean> => {
    try {
      if (!messageId || !nickname || !content) {
        console.error("메시지 전송에 필요한 필드가 누락되었습니다");
        toast.error("메시지 전송에 필요한 정보가 부족합니다", {
          id: "message-validation-error"
        });
        return false;
      }
      
      console.log("Supabase에 메시지 전송:", { messageId, nickname, content });
      
      // 타임아웃 처리 개선
      const timeoutPromise = new Promise<{error: Error}>((_, reject) => {
        setTimeout(() => reject(new Error("메시지 전송 시간 초과")), CONNECTION_TIMEOUT);
      });
      
      const insertPromise = supabase
        .from('community_messages')
        .insert([{
          id: messageId,
          nickname,
          content,
          color
        }]);
        
      // Race 조건으로 타임아웃 처리
      const { error } = await Promise.race([
        insertPromise,
        timeoutPromise
      ]);
        
      if (error) {
        console.error("채팅 메시지 전송 중 오류:", error);
        
        if (retries < maxRetries) {
          retries++;
          console.log(`메시지 전송 재시도 중... (${retries}/${maxRetries})`);
          // 지수 백오프 적용
          const delay = Math.min(500 * Math.pow(2, retries - 1), 8000);
          await new Promise(r => setTimeout(r, delay));
          return attemptSend();
        }
        
        toast.error("메시지 전송에 실패했습니다. 잠시 후 다시 시도해주세요.", {
          id: "send-message-error",
          duration: 5000
        });
        throw error;
      }
      
      console.log("메시지가 성공적으로 Supabase에 전송되었습니다");
      return true;
    } catch (error) {
      console.error("sendChatMessage에서 오류:", error);
      toast.error("메시지 전송에 실패했습니다. 잠시 후 다시 시도해주세요.", {
        id: "send-message-error",
        duration: 5000
      });
      return false;
    }
  };
  
  return attemptSend();
};

// 개선된 채널 상태 확인 함수
export const checkChannelHealth = async (): Promise<boolean> => {
  try {
    console.log("채널 상태 확인 중...");
    
    // 타임아웃 처리 최적화
    const timeoutPromise = new Promise<{data: null, error: Error}>((_, reject) => {
      setTimeout(() => reject(new Error("건강 확인 시간 초과")), CONNECTION_TIMEOUT / 2);
    });
    
    const queryPromise = supabase
      .from('community_messages')
      .select('created_at')
      .limit(1)
      .maybeSingle();
    
    // 간단한 쿼리로 데이터베이스 연결 상태 확인 (타임아웃 처리 포함)
    const startTime = Date.now();
    const { error } = await Promise.race([
      queryPromise,
      timeoutPromise
    ]);
    
    const responseTime = Date.now() - startTime;
    console.log(`채널 응답 시간: ${responseTime}ms`);
    
    if (error) {
      console.error("채널 상태 확인 실패:", error);
      return false;
    }
    
    // 응답 시간이 비정상적으로 높으면 건강하지 않은 것으로 간주
    if (responseTime > CONNECTION_TIMEOUT / 3) {
      console.warn(`채널 응답 시간이 너무 깁니다: ${responseTime}ms`);
      return false;
    }
    
    // 연결이 정상적으로 작동하면 true 반환
    return true;
  } catch (error) {
    console.error("채널 상태 확인 중 오류:", error);
    return false;
  }
};

// 연결 진단 함수 개선
export const diagnoseConnection = async (): Promise<{
  status: 'good' | 'poor' | 'bad',
  details: string,
  responseTime?: number
}> => {
  try {
    const checkStart = Date.now();
    
    // 1. 기본 네트워크 연결 확인 - Supabase 도메인 가용성 확인
    let networkStatus = 'unknown';
    try {
      const res = await fetch('https://plimzlmmftdbpipbnhsy.supabase.co/auth/v1/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      networkStatus = res.ok ? 'connected' : 'error';
    } catch (e) {
      networkStatus = 'disconnected';
    }
    
    // 2. 데이터베이스 상태 확인
    let responseTime = 0;
    const dbHealthStartTime = Date.now();
    const dbHealthy = await checkChannelHealth();
    responseTime = Date.now() - dbHealthStartTime;
    
    // 3. 진단 결과 종합
    const checkDuration = Date.now() - checkStart;
    
    if (networkStatus === 'disconnected') {
      return {
        status: 'bad',
        details: '네트워크 연결 문제: Supabase 서버에 접근할 수 없습니다. 인터넷 연결을 확인해주세요.',
        responseTime
      };
    } else if (!dbHealthy) {
      return {
        status: 'poor',
        details: `데이터베이스 연결 문제: Supabase 데이터베이스에 접근할 수 있으나 응답이 느립니다. (${responseTime}ms)`,
        responseTime
      };
    } else if (checkDuration > 5000) {
      return {
        status: 'poor',
        details: `연결 성능 저하: 진단에 ${checkDuration}ms가 소요되었습니다. 네트워크 상태가 불안정할 수 있습니다.`,
        responseTime
      };
    }
    
    return {
      status: 'good',
      details: `양호한 연결 상태: 진단에 ${checkDuration}ms가 소요되었습니다.`,
      responseTime
    };
  } catch (error) {
    console.error("연결 진단 중 오류:", error);
    return {
      status: 'bad',
      details: '연결 진단 실패: 알 수 없는 오류가 발생했습니다.'
    };
  }
};

// 서버 시간 확인 (지연시간 측정용)
export const checkServerTime = async (): Promise<number | null> => {
  try {
    const startTime = Date.now();
    // 타입 문제 해결: now 함수 호출 (대신 파라미터 없이)
    const { data, error } = await supabase.rpc('now' as never);
    
    if (error) {
      console.error("서버 시간 확인 실패:", error);
      return null;
    }
    
    const endTime = Date.now();
    const latency = endTime - startTime;
    
    return latency;
  } catch (error) {
    console.error("서버 시간 확인 중 오류:", error);
    return null;
  }
};

// 새로운 함수 추가: 채팅 연결 품질 평가
export const evaluateConnectionQuality = async (): Promise<{
  quality: 'good' | 'acceptable' | 'poor',
  latency: number | null,
  recommendation: string
}> => {
  const latency = await checkServerTime();
  
  if (latency === null) {
    return {
      quality: 'poor',
      latency: null,
      recommendation: '서버 연결 상태를 확인할 수 없습니다. 네트워크 연결을 확인해주세요.'
    };
  }
  
  if (latency < 300) {
    return {
      quality: 'good',
      latency,
      recommendation: '연결 상태가 양호합니다.'
    };
  } else if (latency < 1000) {
    return {
      quality: 'acceptable',
      latency,
      recommendation: '연결 상태가 보통입니다. 안정적인 네트워크 환경에서 사용하는 것이 좋습니다.'
    };
  } else {
    return {
      quality: 'poor',
      latency,
      recommendation: '연결 상태가 좋지 않습니다. 새로고침을 하거나 네트워크 연결을 확인해주세요.'
    };
  }
};
