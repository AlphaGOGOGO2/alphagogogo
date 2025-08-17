import { supabase } from "@/integrations/supabase/client";

// Enhanced security middleware for edge functions
export async function enhanceEdgeFunctionSecurity() {
  const { data, error } = await supabase.functions.invoke('secure-admin-auth', {
    body: {
      action: 'enhance_security'
    }
  });

  if (error) {
    console.error('Failed to enhance edge function security:', error);
    return false;
  }

  return data.success;
}

// Additional security validation functions
export function validateSecureInput(input: string): boolean {
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
    /style\s*=.*expression\s*\(/gi,
    /eval\s*\(/gi,
    /Function\s*\(/gi,
  ];

  return !dangerousPatterns.some(pattern => pattern.test(input));
}

export function sanitizeForDatabase(input: string): string {
  return input
    .replace(/[<>'"]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

// Rate limiting with exponential backoff
export class EnhancedRateLimit {
  private static attempts: Map<string, { count: number; lastAttempt: number; backoffUntil: number }> = new Map();

  static check(key: string, maxAttempts: number = 5, windowMs: number = 60000): { allowed: boolean; backoffMs: number } {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record) {
      this.attempts.set(key, { count: 1, lastAttempt: now, backoffUntil: 0 });
      return { allowed: true, backoffMs: 0 };
    }

    // Check if still in backoff period
    if (now < record.backoffUntil) {
      return { allowed: false, backoffMs: record.backoffUntil - now };
    }

    // Reset if window has passed
    if (now - record.lastAttempt > windowMs) {
      this.attempts.set(key, { count: 1, lastAttempt: now, backoffUntil: 0 });
      return { allowed: true, backoffMs: 0 };
    }

    record.count++;
    record.lastAttempt = now;

    if (record.count > maxAttempts) {
      // Exponential backoff: 2^(attempts-maxAttempts) minutes, max 1 hour
      const backoffMinutes = Math.min(60, Math.pow(2, record.count - maxAttempts));
      record.backoffUntil = now + (backoffMinutes * 60 * 1000);
      
      return { allowed: false, backoffMs: record.backoffUntil - now };
    }

    return { allowed: true, backoffMs: 0 };
  }

  static reset(key: string): void {
    this.attempts.delete(key);
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.attempts.entries()) {
      if (now > record.backoffUntil && now - record.lastAttempt > 60000) {
        this.attempts.delete(key);
      }
    }
  }
}

// Initialize cleanup interval
if (typeof window !== 'undefined') {
  setInterval(() => {
    EnhancedRateLimit.cleanup();
  }, 5 * 60 * 1000); // Every 5 minutes
}