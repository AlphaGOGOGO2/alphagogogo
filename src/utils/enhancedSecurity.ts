import { logSecurityEvent } from '@/services/secureAuthService';

// Enhanced session monitoring
export class SessionMonitor {
  private static instance: SessionMonitor;
  private sessionTimeout: number = 30 * 60 * 1000; // 30 minutes
  private warningTimeout: number = 5 * 60 * 1000; // 5 minutes before expiry
  private checkInterval: number = 60 * 1000; // Check every minute
  private intervalId: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): SessionMonitor {
    if (!SessionMonitor.instance) {
      SessionMonitor.instance = new SessionMonitor();
    }
    return SessionMonitor.instance;
  }

  startMonitoring(): void {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      this.checkSessionActivity();
    }, this.checkInterval);
  }

  stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private checkSessionActivity(): void {
    const lastActivity = localStorage.getItem('last_activity');
    if (!lastActivity) return;

    const timeSinceActivity = Date.now() - parseInt(lastActivity);
    
    if (timeSinceActivity > this.sessionTimeout) {
      this.handleSessionExpiry();
    } else if (timeSinceActivity > this.sessionTimeout - this.warningTimeout) {
      this.showSessionWarning();
    }
  }

  private handleSessionExpiry(): void {
    logSecurityEvent('SESSION_EXPIRED', 'User session expired due to inactivity');
    // Clear session and redirect
    sessionStorage.clear();
    localStorage.removeItem('last_activity');
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  private showSessionWarning(): void {
    // Could implement a toast notification here
    console.warn('Session will expire soon due to inactivity');
  }

  updateActivity(): void {
    localStorage.setItem('last_activity', Date.now().toString());
  }
}

// Rate limiting for specific endpoints
export class EndpointRateLimit {
  private static limits: Map<string, { count: number; resetTime: number }> = new Map();

  static check(endpoint: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const key = `${endpoint}_${Math.floor(now / windowMs)}`;
    
    const current = this.limits.get(key) || { count: 0, resetTime: now + windowMs };
    
    if (now > current.resetTime) {
      this.limits.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (current.count >= maxRequests) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', `Rate limit exceeded for endpoint: ${endpoint}`);
      return false;
    }
    
    current.count++;
    this.limits.set(key, current);
    return true;
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [key, limit] of this.limits.entries()) {
      if (now > limit.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

// Enhanced input validation with context awareness
export const validateWithContext = {
  blogPost: (data: any, context: { isEdit?: boolean; userRole?: string } = {}) => {
    const errors: string[] = [];
    
    // Title validation
    if (!data.title || data.title.length < 3) {
      errors.push('제목은 최소 3자 이상이어야 합니다');
    }
    if (data.title && data.title.length > 200) {
      errors.push('제목은 200자를 초과할 수 없습니다');
    }
    
    // Content validation
    if (!data.content || data.content.length < 50) {
      errors.push('내용은 최소 50자 이상이어야 합니다');
    }
    if (data.content && data.content.length > 100000) {
      errors.push('내용은 100,000자를 초과할 수 없습니다');
    }
    
    // Category validation
    const allowedCategories = [
      'AI News', 'ChatGPT Guides', 'Tech Reviews', 'Tutorials', 
      'Lifestyle', 'Lovable Dev', 'Trending', 'Latest AI Updates'
    ];
    if (!data.category || !allowedCategories.includes(data.category)) {
      errors.push('유효하지 않은 카테고리입니다');
    }
    
    // Check for suspicious patterns
    if (data.content && validateWithContext.containsSuspiciousContent(data.content)) {
      errors.push('의심스러운 내용이 감지되었습니다');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings: validateWithContext.generateWarnings(data, context)
    };
  },

  containsSuspiciousContent: (content: string): boolean => {
    const suspiciousPatterns = [
      /<script/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /eval\s*\(/gi,
      /document\.cookie/gi,
      /localStorage\./gi,
      /sessionStorage\./gi
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(content));
  },

  generateWarnings: (data: any, context: any): string[] => {
    const warnings: string[] = [];
    
    if (data.title && data.title.length < 10) {
      warnings.push('제목이 너무 짧습니다. SEO를 위해 더 자세한 제목을 권장합니다');
    }
    
    if (data.content && !data.excerpt) {
      warnings.push('요약을 추가하면 SEO에 도움이 됩니다');
    }
    
    return warnings;
  }
};

// Anomaly detection
export class AnomalyDetector {
  private static patterns: Map<string, number[]> = new Map();

  static recordAction(action: string, timestamp: number = Date.now()): void {
    const times = this.patterns.get(action) || [];
    times.push(timestamp);
    
    // Keep only last 100 actions
    if (times.length > 100) {
      times.shift();
    }
    
    this.patterns.set(action, times);
  }

  static detectAnomaly(action: string, threshold: number = 10): boolean {
    const times = this.patterns.get(action) || [];
    if (times.length < 3) return false;
    
    const now = Date.now();
    const recentActions = times.filter(time => now - time < 60000); // Last minute
    
    if (recentActions.length > threshold) {
      logSecurityEvent('ANOMALY_DETECTED', `Unusual activity pattern detected for action: ${action}`, {
        action,
        count: recentActions.length,
        threshold
      });
      return true;
    }
    
    return false;
  }
}

// Initialize security monitoring on import
if (typeof window !== 'undefined') {
  const sessionMonitor = SessionMonitor.getInstance();
  sessionMonitor.startMonitoring();
  
  // Track user activity
  ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
    document.addEventListener(event, () => {
      sessionMonitor.updateActivity();
    }, { passive: true });
  });
  
  // Cleanup intervals
  setInterval(() => {
    EndpointRateLimit.cleanup();
  }, 5 * 60 * 1000); // Every 5 minutes
}
