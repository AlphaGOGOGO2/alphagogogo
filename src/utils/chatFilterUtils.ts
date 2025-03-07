
// 금지된 단어 목록 (실제 사용 시 더 많은 단어 추가 필요)
export const forbiddenWords = [
  "바보", "멍청이", "병신", "씨발", "지랄", "개새끼", "미친",
  "섹스", "자지", "보지", "성관계", "야동",
  // 더 많은 단어를 여기에 추가할 수 있습니다
];

// 메시지에 금지된 단어가 포함되어 있는지 확인하는 함수
export const containsForbiddenWords = (message: string): boolean => {
  const lowerCaseMessage = message.toLowerCase();
  return forbiddenWords.some(word => lowerCaseMessage.includes(word));
};

// 금지된 단어를 '*'로 치환하는 함수
export const censorMessage = (message: string): string => {
  let censoredMessage = message;
  forbiddenWords.forEach(word => {
    // 대소문자 구분 없이 모든 금지 단어를 찾아 '*'로 치환
    const regex = new RegExp(word, 'gi');
    censoredMessage = censoredMessage.replace(regex, '*'.repeat(word.length));
  });
  return censoredMessage;
};
