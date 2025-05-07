
/**
 * 날짜와 시간 관련 유틸리티 함수
 */

// 주어진 날짜가 현재보다 미래인지 확인 (여유 시간 포함)
export const isFutureDate = (date: Date | string, bufferMinutes = 0): boolean => {
  // 입력이 null이나 undefined인 경우 처리
  if (!date) return false;
  
  const compareDate = date instanceof Date ? date : new Date(date);
  const now = new Date();
  
  // 비교를 위해 버퍼 시간(분) 추가
  if (bufferMinutes > 0) {
    now.setMinutes(now.getMinutes() + bufferMinutes);
  }
  
  // Date 객체가 유효한지 확인 - 빠른 검증
  if (isNaN(compareDate.getTime())) {
    console.error(`[날짜비교] 유효하지 않은 날짜 입력: ${date}`);
    return false;
  }
  
  return compareDate > now;
};

// 가독성 있는 형식으로 날짜 변환 - 성능 최적화
export const formatReadableDate = (date: Date | string): string => {
  // 입력이 null이나 undefined인 경우 처리
  if (!date) return '날짜 정보 없음';
  
  try {
    const d = date instanceof Date ? date : new Date(date);
    
    // 날짜가 유효하지 않은 경우 - 빠른 검증
    if (isNaN(d.getTime())) {
      return '날짜 정보 없음';
    }
    
    return d.toLocaleString('ko-KR');
  } catch {
    return '날짜 정보 없음';
  }
};

// 발행 예정 시간까지 남은 시간을 문자열로 반환 - 성능 최적화
export const getTimeUntilPublish = (publishDate: Date | string): string => {
  // 입력이 null이나 undefined인 경우 처리
  if (!publishDate) return '정보 없음';
  
  try {
    const pubDate = publishDate instanceof Date ? publishDate : new Date(publishDate);
    const now = new Date();
    
    // 날짜가 유효하지 않은 경우 - 빠른 검증
    if (isNaN(pubDate.getTime())) {
      return '정보 없음';
    }
    
    const minutesDiff = Math.round((pubDate.getTime() - now.getTime()) / (1000 * 60));
    
    // 이미 발행된 경우
    if (minutesDiff < 0) {
      return '이미 발행됨';
    }
    
    const hoursDiff = Math.floor(minutesDiff / 60);
    
    if (hoursDiff > 0) {
      return `약 ${hoursDiff}시간 ${minutesDiff % 60}분 후`;
    } else {
      return `약 ${minutesDiff}분 후`;
    }
  } catch {
    return '정보 없음';
  }
};
