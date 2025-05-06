
import { v4 as uuidv4 } from 'uuid';

// 브라우저 로컬 스토리지에서 클라이언트 ID를 가져오거나 없으면 새로 생성
export const getClientId = (): string => {
  const storageKey = 'alpha_gogogo_client_id';
  
  try {
    let clientId = localStorage.getItem(storageKey);
    
    // localStorage에서 clientId 체크를 더 엄격하게 수행
    if (!clientId || clientId === 'null' || clientId === 'undefined' || clientId.trim() === '') {
      clientId = uuidv4();
      console.log("새 클라이언트 ID 생성됨:", clientId);
      
      // localStorage에 ID 저장 시도
      try {
        localStorage.setItem(storageKey, clientId);
        console.log("클라이언트 ID가 localStorage에 저장됨:", clientId);
      } catch (storageError) {
        console.error("localStorage 저장 오류:", storageError);
      }
    } else {
      console.log("기존 클라이언트 ID 사용:", clientId);
    }
    
    return clientId;
  } catch (error) {
    console.error("클라이언트 ID 처리 오류:", error);
    // 로컬 스토리지에 접근할 수 없는 경우 세션별 임시 ID 반환
    const sessionId = uuidv4();
    console.log("localStorage 접근 불가, 세션 ID 사용:", sessionId);
    return sessionId;
  }
};

// 클라이언트 ID 확인 및 디버깅용 함수
export const verifyClientId = (): string | null => {
  try {
    const storageKey = 'alpha_gogogo_client_id';
    const clientId = localStorage.getItem(storageKey);
    
    if (clientId && clientId !== 'null' && clientId !== 'undefined' && clientId.trim() !== '') {
      console.log("저장된 클라이언트 ID 확인됨:", clientId);
      return clientId;
    } else {
      console.warn("저장된 클라이언트 ID가 없거나 유효하지 않음");
      return null;
    }
  } catch (error) {
    console.error("클라이언트 ID 확인 오류:", error);
    return null;
  }
};

// 강제로 클라이언트 ID를 재설정하는 함수 (디버깅용)
export const resetClientId = (): string => {
  const storageKey = 'alpha_gogogo_client_id';
  const newId = uuidv4();
  
  try {
    localStorage.removeItem(storageKey);
    localStorage.setItem(storageKey, newId);
    console.log("클라이언트 ID 재설정됨:", newId);
    return newId;
  } catch (error) {
    console.error("클라이언트 ID 재설정 오류:", error);
    return newId;
  }
};
