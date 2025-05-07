
/**
 * 날짜와 시간 관련 유틸리티 함수
 */

// 주어진 날짜가 현재보다 미래인지 확인 (여유 시간 포함)
export const isFutureDate = (date: Date | string, bufferMinutes = 5): boolean => {
  const compareDate = date instanceof Date ? date : new Date(date);
  const now = new Date();
  
  // 비교를 위해 버퍼 시간(분) 추가
  if (bufferMinutes > 0) {
    now.setMinutes(now.getMinutes() + bufferMinutes);
  }
  
  console.log(`[날짜비교] 비교날짜: ${compareDate.toISOString()}, 현재(버퍼포함): ${now.toISOString()}, 결과: ${compareDate > now}`);
  return compareDate > now;
};

// 가독성 있는 형식으로 날짜 변환
export const formatReadableDate = (date: Date | string): string => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleString('ko-KR');
};

// 발행 예정 시간까지 남은 시간을 문자열로 반환
export const getTimeUntilPublish = (publishDate: Date | string): string => {
  const pubDate = publishDate instanceof Date ? publishDate : new Date(publishDate);
  const now = new Date();
  
  const minutesDiff = Math.round((pubDate.getTime() - now.getTime()) / (1000 * 60));
  const hoursDiff = Math.floor(minutesDiff / 60);
  
  if (hoursDiff > 0) {
    return `약 ${hoursDiff}시간 ${minutesDiff % 60}분 후`;
  } else {
    return `약 ${minutesDiff}분 후`;
  }
};
