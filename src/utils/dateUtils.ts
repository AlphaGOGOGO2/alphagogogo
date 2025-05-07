
/**
 * 날짜와 시간 관련 유틸리티 함수 - 간소화 버전
 */

// 주어진 날짜가 현재보다 미래인지 확인
export const isFutureDate = (date: Date | string): boolean => {
  if (!date) return false;
  
  const compareDate = date instanceof Date ? date : new Date(date);
  const now = new Date();
  
  // 유효하지 않은 날짜 처리
  if (isNaN(compareDate.getTime())) {
    return false;
  }
  
  return compareDate > now;
};

// 가독성 있는 형식으로 날짜 변환
export const formatReadableDate = (date: Date | string): string => {
  if (!date) return '날짜 정보 없음';
  
  try {
    const d = date instanceof Date ? date : new Date(date);
    
    if (isNaN(d.getTime())) {
      return '날짜 정보 없음';
    }
    
    return d.toLocaleString('ko-KR');
  } catch {
    return '날짜 정보 없음';
  }
};

// 발행 예정 시간까지 남은 시간을 문자열로 반환
export const getTimeUntilPublish = (publishDate: Date | string): string => {
  if (!publishDate) return '정보 없음';
  
  try {
    const pubDate = publishDate instanceof Date ? publishDate : new Date(publishDate);
    const now = new Date();
    
    if (isNaN(pubDate.getTime())) {
      return '정보 없음';
    }
    
    const minutesDiff = Math.round((pubDate.getTime() - now.getTime()) / (1000 * 60));
    
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

// 두 날짜가 동일한지 비교 (ISO 문자열 처리 개선)
export const isSameDate = (date1: Date | string, date2: Date | string): boolean => {
  if (!date1 || !date2) return false;
  
  try {
    const d1 = date1 instanceof Date ? date1 : new Date(date1);
    const d2 = date2 instanceof Date ? date2 : new Date(date2);
    
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return false;
    }
    
    return d1.getTime() === d2.getTime();
  } catch {
    return false;
  }
};

// ISO 문자열을 Date 객체로 안전하게 변환
export const safeParseDate = (dateStr: string | Date): Date | null => {
  if (!dateStr) return null;
  
  if (dateStr instanceof Date) return dateStr;
  
  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

// 날짜가 현재보다 과거인지 확인 (발행된 게시글인지 확인용)
export const isPastDate = (date: Date | string): boolean => {
  if (!date) return false;
  
  const compareDate = date instanceof Date ? date : new Date(date);
  const now = new Date();
  
  // 유효하지 않은 날짜 처리
  if (isNaN(compareDate.getTime())) {
    return false;
  }
  
  // 현재 시간보다 5초 미만의 차이는 같은 시간으로 간주 (시간 동기화 문제 방지)
  const diffMs = now.getTime() - compareDate.getTime();
  return diffMs > -5000; // 5초의 여유를 둠
};
