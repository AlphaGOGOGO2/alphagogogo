
import { v4 as uuidv4 } from 'uuid';

// 브라우저 로컬 스토리지에서 클라이언트 ID를 가져오거나 없으면 새로 생성
export const getClientId = (): string => {
  const storageKey = 'alpha_gogogo_client_id';
  
  try {
    let clientId = localStorage.getItem(storageKey);
    
    // localStorage에서 clientId 체크를 더 엄격하게 수행
    if (!clientId || clientId === 'null' || clientId === 'undefined' || clientId.trim() === '') {
      clientId = uuidv4();
      
      // localStorage에 ID 저장 시도
      try {
        localStorage.setItem(storageKey, clientId);
      } catch (storageError) {
        console.error("localStorage 저장 오류:", storageError);
      }
    }
    
    return clientId;
  } catch (error) {
    console.error("클라이언트 ID 처리 오류:", error);
    // 로컬 스토리지에 접근할 수 없는 경우 세션별 임시 ID 반환
    return uuidv4();
  }
};

// 클라이언트 ID 확인 함수 (관리자 페이지에서 사용)
export const verifyClientId = (): string | null => {
  try {
    const storageKey = 'alpha_gogogo_client_id';
    const clientId = localStorage.getItem(storageKey);
    
    if (clientId && clientId !== 'null' && clientId !== 'undefined' && clientId.trim() !== '') {
      return clientId;
    } else {
      return null;
    }
  } catch (error) {
    console.error("클라이언트 ID 확인 오류:", error);
    return null;
  }
};

// 테스트용 ID 재설정 함수 (관리자 페이지에서 사용)
export const resetClientId = (): string => {
  const storageKey = 'alpha_gogogo_client_id';
  const newId = uuidv4();
  
  try {
    localStorage.removeItem(storageKey);
    localStorage.setItem(storageKey, newId);
    return newId;
  } catch (error) {
    console.error("클라이언트 ID 재설정 오류:", error);
    return newId;
  }
};
