
// 금지어 목록
const FORBIDDEN_WORDS = [
  // 욕설, 비속어 등 필터링할 단어들
  // 실제 구현에서는 이 부분에 적절한 금지어 목록을 추가
];

/**
 * 메시지에서 금지어를 확인하는 함수
 * @param message 확인할 메시지 내용
 * @returns 금지어가 포함되어 있으면 true, 아니면 false
 */
export function containsForbiddenWords(message: string): boolean {
  if (!message) return false;
  
  const lowerMessage = message.toLowerCase();
  
  return FORBIDDEN_WORDS.some(word => 
    lowerMessage.includes(word.toLowerCase())
  );
}
