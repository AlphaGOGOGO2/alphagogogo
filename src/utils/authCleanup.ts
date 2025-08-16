// 인증 상태를 완전히 정리하여 "limbo" 상태를 방지합니다
export const cleanupAuthState = () => {
  try {
    // 표준 키 제거
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('supabase.auth.token');

    // Supabase 관련 모든 키 제거
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (e) {
    // 스토리지가 사용 불가한 환경에서도 실패 없이 진행
  }
};
