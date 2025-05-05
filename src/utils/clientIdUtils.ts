
import { v4 as uuidv4 } from 'uuid';

// 브라우저 로컬 스토리지에서 클라이언트 ID를 가져오거나 없으면 새로 생성
export const getClientId = (): string => {
  const storageKey = 'alpha_gogogo_client_id';
  
  try {
    let clientId = localStorage.getItem(storageKey);
    
    if (!clientId) {
      clientId = uuidv4();
      localStorage.setItem(storageKey, clientId);
      console.log("새 클라이언트 ID 생성됨:", clientId);
    }
    
    return clientId;
  } catch (error) {
    console.error("클라이언트 ID 처리 오류:", error);
    // 로컬 스토리지에 접근할 수 없는 경우 임시 ID 반환
    return uuidv4();
  }
};
