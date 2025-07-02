// 앱 상태 확인 및 디버깅 유틸리티

export interface HealthCheckResult {
  status: 'healthy' | 'warning' | 'error';
  checks: Array<{
    name: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
  }>;
}

export function performHealthCheck(): HealthCheckResult {
  const checks = [];
  let overallStatus: 'healthy' | 'warning' | 'error' = 'healthy';

  // React 체크
  try {
    const reactElement = document.getElementById('root');
    if (!reactElement) {
      checks.push({
        name: 'React Root Element',
        status: 'fail' as const,
        message: 'Root element not found'
      });
      overallStatus = 'error';
    } else if (!reactElement.children.length) {
      checks.push({
        name: 'React Root Element',
        status: 'warning' as const,
        message: 'Root element exists but appears empty'
      });
      overallStatus = 'warning';
    } else {
      checks.push({
        name: 'React Root Element',
        status: 'pass' as const,
        message: 'Root element found and populated'
      });
    }
  } catch (error) {
    checks.push({
      name: 'React Root Element',
      status: 'fail' as const,
      message: `Error checking root: ${error}`
    });
    overallStatus = 'error';
  }

  // JavaScript 에러 체크
  const errorCount = (window as any).__errorCount || 0;
  if (errorCount > 0) {
    checks.push({
      name: 'JavaScript Errors',
      status: 'warning' as const,
      message: `${errorCount} JavaScript errors detected`
    });
    if (overallStatus === 'healthy') overallStatus = 'warning';
  } else {
    checks.push({
      name: 'JavaScript Errors',
      status: 'pass' as const,
      message: 'No JavaScript errors detected'
    });
  }

  // 네트워크 연결 체크
  if (navigator.onLine) {
    checks.push({
      name: 'Network Connection',
      status: 'pass' as const,
      message: 'Online'
    });
  } else {
    checks.push({
      name: 'Network Connection',
      status: 'warning' as const,
      message: 'Offline'
    });
    if (overallStatus === 'healthy') overallStatus = 'warning';
  }

  // Local Storage 접근 체크
  try {
    localStorage.setItem('health-check', 'test');
    localStorage.removeItem('health-check');
    checks.push({
      name: 'Local Storage',
      status: 'pass' as const,
      message: 'Accessible'
    });
  } catch (error) {
    checks.push({
      name: 'Local Storage',
      status: 'warning' as const,
      message: 'Not accessible or disabled'
    });
    if (overallStatus === 'healthy') overallStatus = 'warning';
  }

  return {
    status: overallStatus,
    checks
  };
}

// 글로벌 에러 추적
export function initErrorTracking() {
  if (typeof window === 'undefined') return;

  let errorCount = 0;
  
  window.addEventListener('error', (event) => {
    errorCount++;
    (window as any).__errorCount = errorCount;
    console.error('[Health Check] JavaScript Error:', {
      message: event.message,
      filename: event.filename,
      line: event.lineno,
      column: event.colno,
      error: event.error
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    errorCount++;
    (window as any).__errorCount = errorCount;
    console.error('[Health Check] Unhandled Promise Rejection:', event.reason);
  });
}

// 주기적인 상태 체크
export function startHealthMonitoring(intervalMs: number = 30000) {
  if (typeof window === 'undefined') return;

  const checkHealth = () => {
    const result = performHealthCheck();
    if (result.status === 'error') {
      console.error('[Health Check] Critical issues detected:', result);
    } else if (result.status === 'warning') {
      console.warn('[Health Check] Warning level issues detected:', result);
    } else {
      console.log('[Health Check] All systems healthy');
    }
  };

  // 즉시 실행
  checkHealth();
  
  // 주기적 실행
  return setInterval(checkHealth, intervalMs);
}