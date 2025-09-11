import { supabase } from "@/integrations/supabase/client";

/**
 * 다운로드 개인정보 보호 유틸리티
 * 사용자 다운로드 추적 데이터를 안전하게 처리
 */

/**
 * IP 주소를 익명화하여 개인정보를 보호
 */
export const anonymizeIpAddress = (ip: string): string => {
  if (!ip) return '';
  
  // IPv4인 경우 마지막 옥텟을 0으로 마스킹
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      parts[3] = '0';
      return parts.join('.');
    }
  }
  
  // IPv6인 경우 마지막 4개 그룹을 마스킹
  if (ip.includes(':')) {
    const parts = ip.split(':');
    if (parts.length >= 4) {
      for (let i = parts.length - 4; i < parts.length; i++) {
        parts[i] = '0';
      }
      return parts.join(':');
    }
  }
  
  return ip;
};

/**
 * 안전한 다운로드 로깅 - IP 주소를 익명화하여 저장
 */
export const logDownloadSafely = async (resourceId: string): Promise<void> => {
  try {
    // 외부 IP 조회 시도
    let anonymizedIp = 'unknown';
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json', {
        signal: AbortSignal.timeout(3000) // 3초 타임아웃
      });
      const ipData = await ipResponse.json();
      
      if (ipData.ip) {
        // IP 주소를 익명화하여 개인정보 보호
        anonymizedIp = anonymizeIpAddress(ipData.ip);
      }
    } catch (error) {
      console.log('IP address retrieval failed, using anonymous logging');
    }

    // 익명화된 IP로 다운로드 로그 저장
    const { error } = await supabase
      .from('resource_downloads')
      .insert({
        resource_id: resourceId,
        ip_address: anonymizedIp
      });

    if (error) {
      console.error('Download logging error:', error);
    }
  } catch (error) {
    console.error('Safe download logging failed:', error);
  }
};

/**
 * 다운로드 수 증가 (개인정보 보호 적용)
 */
export const incrementDownloadCountSafely = async (resourceId: string): Promise<void> => {
  try {
    // 개인정보를 보호하는 방식으로 다운로드 로깅
    await logDownloadSafely(resourceId);
    
    // 다운로드 수 증가
    const { error } = await supabase.rpc('increment_download_count', {
      resource_id: resourceId
    });

    if (error) {
      console.error('Error incrementing download count:', error);
    }
  } catch (error) {
    console.error('Safe download count increment failed:', error);
  }
};

/**
 * 다운로드 파일명/URL 도우미
 */
export const sanitizeFilename = (name: string) => {
  const trimmed = (name ?? 'download').toString().trim();
  // 1) 유니코드 정규화로 분해 2) 발음 구별 기호 제거 3) ASCII 안전 문자만 남김
  const base = trimmed
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // 결합 문자 제거
    .replace(/[^a-zA-Z0-9._-]+/g, '-') // 비 ASCII 문자는 하이픈으로 대체
    .replace(/-+/g, '-') // 연속 하이픈 축소
    .replace(/^[-.]+|[-.]+$/g, ''); // 앞뒤 구분자 제거
  const safe = base || 'file';
  // 너무 긴 파일명은 잘라내고, 일관성을 위해 소문자화
  return safe.slice(0, 100).toLowerCase();
};

export const getExtensionFromUrl = (url: string) => {
  try {
    const pathname = new URL(url).pathname;
    const last = pathname.split('/').pop() || '';
    const dot = last.lastIndexOf('.');
    return dot >= 0 ? last.slice(dot) : '';
  } catch {
    const dot = url.lastIndexOf('.');
    return dot >= 0 ? url.slice(dot) : '';
  }
};

export const buildDownloadFilename = (title: string, fileUrl: string) => {
  const clean = sanitizeFilename(title || 'download');
  const ext = getExtensionFromUrl(fileUrl) || '';
  return ext ? `${clean}${ext}` : clean;
};

export const buildDownloadUrl = (fileUrl: string, desiredFilename: string) => {
  try {
    const u = new URL(fileUrl);
    u.searchParams.set('download', desiredFilename);
    return u.toString();
  } catch {
    const sep = fileUrl.includes('?') ? '&' : '?';
    return `${fileUrl}${sep}download=${encodeURIComponent(desiredFilename)}`;
  }
};

/**
 * 레거시 코드 경고 - 개인정보 수집을 방지
 */
export const warnAboutPrivacyViolation = () => {
  console.warn(
    'PRIVACY WARNING: Direct IP address collection detected. ' +
    'Use incrementDownloadCountSafely() instead to protect user privacy.'
  );
};

/**
 * 다운로드 통계 조회 (관리자 전용)
 * 주의: 이 함수는 service_role 권한이 필요하며 클라이언트에서 직접 호출할 수 없습니다.
 */
export const getDownloadStatistics = async (resourceId?: string) => {
  // 클라이언트에서는 resource_downloads 테이블을 직접 조회할 수 없음
  // 필요한 경우 Edge Function을 통해서만 조회 가능
  throw new Error(
    'Download statistics access restricted. Use admin dashboard or Edge Function for analytics.'
  );
};