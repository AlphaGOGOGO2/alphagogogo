
/**
 * 날짜와 시간 관련 유틸리티 함수 - 최적화 버전
 */

// 주어진 날짜가 현재보다 미래인지 확인 (5초 버퍼 추가)
export const isFutureDate = (date: Date | string): boolean => {
  try {
    if (!date) return false;
    
    const compareDate = date instanceof Date ? date : new Date(date);
    const now = new Date();
    
    // 유효하지 않은 날짜 처리
    if (isNaN(compareDate.getTime())) {
      console.error("[isFutureDate] 유효하지 않은 날짜:", date);
      return false;
    }
    
    // 5초 버퍼 추가
    const result = compareDate.getTime() > (now.getTime() + 5000);
    console.log(`[isFutureDate] 비교: ${compareDate.toISOString()} > ${now.toISOString()}? ${result}`);
    return result;
  } catch (error) {
    console.error("[isFutureDate] 오류:", error);
    return false;
  }
};

// 주어진 날짜가 현재보다 과거인지 확인 (5초 버퍼 추가)
export const isPastDate = (date: Date | string): boolean => {
  try {
    if (!date) return false;
    
    const compareDate = date instanceof Date ? date : new Date(date);
    const now = new Date();
    
    // 유효하지 않은 날짜 처리
    if (isNaN(compareDate.getTime())) {
      console.error("[isPastDate] 유효하지 않은 날짜:", date);
      return false;
    }
    
    // 5초 버퍼 추가 (미래 날짜가 아니면 과거 날짜로 간주)
    const result = compareDate.getTime() <= (now.getTime() + 5000);
    console.log(`[isPastDate] 비교: ${compareDate.toISOString()} <= ${now.toISOString()}? ${result}`);
    return result;
  } catch (error) {
    console.error("[isPastDate] 오류:", error);
    return false;
  }
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

// 디버깅용 날짜 비교 함수
export const logDateComparison = (
  date1: Date | string, 
  date2: Date | string, 
  label1: string = "날짜1", 
  label2: string = "날짜2"
): void => {
  try {
    const d1 = date1 instanceof Date ? date1 : new Date(date1);
    const d2 = date2 instanceof Date ? date2 : new Date(date2);
    
    console.log(`[날짜 비교] ${label1}: ${d1.toISOString()} (${d1.getTime()})`);
    console.log(`[날짜 비교] ${label2}: ${d2.toISOString()} (${d2.getTime()})`);
    console.log(`[날짜 비교] ${label1} ${d1 > d2 ? '>' : d1 < d2 ? '<' : '=='} ${label2}`);
    console.log(`[날짜 비교] 차이: ${Math.abs(d1.getTime() - d2.getTime())}ms`);
  } catch (error) {
    console.error("[날짜 비교] 오류:", error);
  }
};
