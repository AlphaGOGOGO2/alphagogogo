
import { v4 as uuidv4 } from 'uuid';

// 브라우저 로컬 스토리지에서 클라이언트 ID를 가져오거나 없으면 새로 생성
export const getClientId = (): string => {
  const storageKey = 'genspark_client_id';
  let clientId = localStorage.getItem(storageKey);
  
  if (!clientId) {
    clientId = uuidv4();
    localStorage.setItem(storageKey, clientId);
  }
  
  return clientId;
};
