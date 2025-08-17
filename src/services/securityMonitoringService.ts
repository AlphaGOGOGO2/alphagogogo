import { supabase } from "@/integrations/supabase/client";
import { logSecurityEvent } from "@/services/secureAuthService";

/**
 * Real-time security monitoring and threat detection service
 */

interface SecurityThreat {
  id?: string;
  threat_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  auto_blocked?: boolean;
}

interface SecurityMetrics {
  recent_threats: number;
  high_severity_threats: number;
  blocked_ips: string[];
  anomaly_score: number;
}

export class SecurityMonitoringService {
  private static instance: SecurityMonitoringService;
  private threatCache: Map<string, number> = new Map();
  private blockedIPs: Set<string> = new Set();

  private constructor() {
    this.initializeMonitoring();
  }

  static getInstance(): SecurityMonitoringService {
    if (!SecurityMonitoringService.instance) {
      SecurityMonitoringService.instance = new SecurityMonitoringService();
    }
    return SecurityMonitoringService.instance;
  }

  private initializeMonitoring(): void {
    // Monitor common attack patterns
    this.setupPatternDetection();
    
    // Periodic cleanup and analysis
    setInterval(() => {
      this.performSecurityAnalysis();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  private setupPatternDetection(): void {
    // Monitor for suspicious patterns in user input
    if (typeof window !== 'undefined') {
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        const response = await originalFetch(...args);
        this.analyzeRequest(args[0], args[1]);
        return response;
      };
    }
  }

  private analyzeRequest(input: RequestInfo | URL, init?: RequestInit): void {
    try {
      const url = typeof input === 'string' ? input : input.toString();
      const body = init?.body?.toString() || '';
      
      // Check for common attack patterns
      const suspiciousPatterns = [
        /script.*src/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /eval\s*\(/gi,
        /exec\s*\(/gi,
        /<iframe/gi,
        /union.*select/gi,
        /drop.*table/gi,
        /insert.*into/gi,
      ];

      const foundPatterns = suspiciousPatterns.filter(pattern => 
        pattern.test(url) || pattern.test(body)
      );

      if (foundPatterns.length > 0) {
        this.reportThreat({
          threat_type: 'injection_attempt',
          severity: 'high',
          description: `Suspicious patterns detected in request: ${foundPatterns.length} patterns found`,
          metadata: {
            url: url.substring(0, 200), // Limit URL length for logging
            patterns_found: foundPatterns.length,
            timestamp: Date.now()
          }
        });
      }
    } catch (error) {
      console.error('Error analyzing request:', error);
    }
  }

  async reportThreat(threat: Omit<SecurityThreat, 'id'>): Promise<string | null> {
    try {
      // Get client info
      const userAgent = navigator?.userAgent || 'unknown';
      const ipAddress = await this.getClientIP();

      const { data, error } = await supabase.functions.invoke('secure-admin-auth', {
        body: {
          action: 'detect_threat',
          threat_type: threat.threat_type,
          severity: threat.severity,
          description: threat.description,
          ip_address: ipAddress,
          user_agent: userAgent,
          metadata: threat.metadata || {}
        }
      });

      if (error) {
        console.error('Failed to report threat:', error);
        return null;
      }

      // Update local cache
      const threatKey = `${threat.threat_type}_${ipAddress}`;
      const currentCount = this.threatCache.get(threatKey) || 0;
      this.threatCache.set(threatKey, currentCount + 1);

      // Auto-block if necessary
      if (threat.severity === 'critical' || currentCount > 5) {
        this.blockedIPs.add(ipAddress);
        await logSecurityEvent('IP_AUTO_BLOCKED', `IP ${ipAddress} automatically blocked due to repeated threats`);
      }

      return data.threat_id;
    } catch (error) {
      console.error('Error reporting threat:', error);
      return null;
    }
  }

  private async getClientIP(): Promise<string> {
    try {
      // This is a simplified IP detection - in production you'd use a proper service
      return '127.0.0.1'; // Fallback for local development
    } catch {
      return '127.0.0.1';
    }
  }

  async getSecurityMetrics(): Promise<SecurityMetrics> {
    try {
      const { data, error } = await supabase.functions.invoke('secure-admin-auth', {
        body: {
          action: 'get_security_metrics'
        }
      });

      if (error) {
        console.error('Failed to get security metrics:', error);
        return this.getDefaultMetrics();
      }

      return data;
    } catch (error) {
      console.error('Error getting security metrics:', error);
      return this.getDefaultMetrics();
    }
  }

  private getDefaultMetrics(): SecurityMetrics {
    return {
      recent_threats: 0,
      high_severity_threats: 0,
      blocked_ips: Array.from(this.blockedIPs),
      anomaly_score: 0
    };
  }

  private performSecurityAnalysis(): void {
    // Analyze threat patterns
    let anomalyScore = 0;
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);

    // Calculate anomaly score based on recent activity
    for (const [key, count] of this.threatCache.entries()) {
      if (count > 3) {
        anomalyScore += count * 10;
      }
    }

    // Clean old entries
    this.threatCache.clear();

    // Report high anomaly scores
    if (anomalyScore > 50) {
      this.reportThreat({
        threat_type: 'anomaly_detected',
        severity: 'medium',
        description: `High anomaly score detected: ${anomalyScore}`,
        metadata: {
          anomaly_score: anomalyScore,
          timestamp: now
        }
      });
    }
  }

  // Detect brute force attempts
  detectBruteForce(identifier: string, maxAttempts: number = 5): boolean {
    const key = `brute_force_${identifier}`;
    const attempts = this.threatCache.get(key) || 0;
    
    if (attempts >= maxAttempts) {
      this.reportThreat({
        threat_type: 'brute_force',
        severity: 'critical',
        description: `Brute force attack detected for ${identifier}`,
        metadata: {
          identifier: identifier.substring(0, 50), // Limit length
          attempts,
          max_attempts: maxAttempts
        }
      });
      return true;
    }

    this.threatCache.set(key, attempts + 1);
    return false;
  }

  // Check if IP is blocked
  isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip);
  }

  // Manual IP blocking
  async blockIP(ip: string, reason: string): Promise<void> {
    this.blockedIPs.add(ip);
    await this.reportThreat({
      threat_type: 'manual_ip_block',
      severity: 'medium',
      description: `IP manually blocked: ${reason}`,
      ip_address: ip,
      metadata: { reason }
    });
  }

  // Unblock IP
  unblockIP(ip: string): void {
    this.blockedIPs.delete(ip);
  }
}

export const securityMonitor = SecurityMonitoringService.getInstance();