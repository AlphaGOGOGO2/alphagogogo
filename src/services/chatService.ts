
import { supabase } from "@/integrations/supabase/client";

// 채널 상태 확인
export const checkChannelHealth = async (): Promise<boolean> => {
  try {
    // 단순한 쿼리로 연결 상태 확인
    const { data, error } = await supabase
      .from('community_messages')
      .select('count(*)')
      .limit(1)
      .single();
    
    return !error;
  } catch (e) {
    console.error("채널 상태 확인 중 오류:", e);
    return false;
  }
};

// 최근 메시지 가져오기
export const fetchRecentMessages = async (limit = 100) => {
  try {
    const { data, error } = await supabase
      .from('community_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("메시지 가져오기 실패:", error);
    return [];
  }
};

// 메시지 전송
export const sendChatMessage = async (
  messageId: string, 
  nickname: string, 
  content: string, 
  userColor: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('community_messages')
      .insert([{
        id: messageId,
        nickname,
        content,
        color: userColor
      }]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("메시지 전송 실패:", error);
    return false;
  }
};

// 연결 상태 진단
export const diagnoseConnection = async () => {
  try {
    // 진단 쿼리 시작 시간
    const startTime = Date.now();
    
    // 기본 쿼리로 연결 상태 확인
    const { error } = await supabase
      .from('community_messages')
      .select('count(*)')
      .limit(1)
      .single();
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (error) {
      return {
        status: 'error',
        details: `연결 오류: ${error.message}`,
        responseTime
      };
    }
    
    // 응답 시간에 따른 상태 분류
    let status = 'good';
    let details = '연결 상태가 양호합니다.';
    
    if (responseTime > 1000) {
      status = 'poor';
      details = `응답 시간이 느립니다 (${responseTime}ms).`;
    } else if (responseTime > 500) {
      status = 'fair';
      details = `응답 시간이 보통입니다 (${responseTime}ms).`;
    } else {
      details = `응답 시간이 양호합니다 (${responseTime}ms).`;
    }
    
    return { status, details, responseTime };
  } catch (error) {
    console.error("연결 진단 중 오류:", error);
    return { 
      status: 'error', 
      details: '연결 진단 중 오류가 발생했습니다.', 
      responseTime: null 
    };
  }
};

// 연결 품질 평가
export const evaluateConnectionQuality = async (): Promise<{ quality: 'good' | 'acceptable' | 'poor' | 'unknown' }> => {
  try {
    const startTime = Date.now();
    const { error } = await supabase
      .from('community_messages')
      .select('count(*)')
      .limit(1)
      .single();
      
    if (error) {
      return { quality: 'poor' };
    }
    
    const responseTime = Date.now() - startTime;
    
    if (responseTime < 300) {
      return { quality: 'good' };
    } else if (responseTime < 1000) {
      return { quality: 'acceptable' };
    } else {
      return { quality: 'poor' };
    }
  } catch (error) {
    console.error("연결 품질 평가 중 오류:", error);
    return { quality: 'unknown' };
  }
};
