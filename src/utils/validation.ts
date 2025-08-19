// 입력 검증 유틸리티

import type { ValidationError } from "@/types/errors";
import { handleValidationError } from "./errorHandler";

// 기본 검증 규칙 타입
export interface ValidationRule<T = unknown> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => boolean | string;
  min?: number;
  max?: number;
  type?: 'string' | 'number' | 'email' | 'url' | 'array' | 'object';
}

export interface ValidationSchema {
  [field: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, ValidationError>;
  firstError?: ValidationError;
}

export class Validator {
  private schema: ValidationSchema;

  constructor(schema: ValidationSchema) {
    this.schema = schema;
  }

  // 단일 값 검증
  validateField<T>(fieldName: string, value: T, rule: ValidationRule<T>): ValidationError | null {
    // Required 검증
    if (rule.required && this.isEmpty(value)) {
      return handleValidationError(fieldName, value, 'required');
    }

    // 빈 값이고 required가 아닌 경우 통과
    if (this.isEmpty(value) && !rule.required) {
      return null;
    }

    // 타입 검증
    if (rule.type && !this.validateType(value, rule.type)) {
      return handleValidationError(fieldName, value, `type:${rule.type}`);
    }

    // 문자열 길이 검증
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        return handleValidationError(fieldName, value, `minLength:${rule.minLength}`);
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        return handleValidationError(fieldName, value, `maxLength:${rule.maxLength}`);
      }
    }

    // 숫자 범위 검증
    if (typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        return handleValidationError(fieldName, value, `min:${rule.min}`);
      }
      if (rule.max !== undefined && value > rule.max) {
        return handleValidationError(fieldName, value, `max:${rule.max}`);
      }
    }

    // 배열 길이 검증
    if (Array.isArray(value)) {
      if (rule.minLength && value.length < rule.minLength) {
        return handleValidationError(fieldName, value, `minLength:${rule.minLength}`);
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        return handleValidationError(fieldName, value, `maxLength:${rule.maxLength}`);
      }
    }

    // 패턴 검증
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return handleValidationError(fieldName, value, `pattern:${rule.pattern.source}`);
    }

    // 커스텀 검증
    if (rule.custom) {
      const customResult = rule.custom(value);
      if (customResult !== true) {
        const constraint = typeof customResult === 'string' ? customResult : 'custom';
        return handleValidationError(fieldName, value, constraint);
      }
    }

    return null;
  }

  // 전체 객체 검증
  validate(data: Record<string, unknown>): ValidationResult {
    const errors: Record<string, ValidationError> = {};
    let isValid = true;

    for (const [fieldName, rule] of Object.entries(this.schema)) {
      const value = data[fieldName];
      const error = this.validateField(fieldName, value, rule);
      
      if (error) {
        errors[fieldName] = error;
        isValid = false;
      }
    }

    return {
      isValid,
      errors,
      firstError: Object.values(errors)[0]
    };
  }

  // 부분 검증 (특정 필드들만)
  validateFields(data: Record<string, unknown>, fieldNames: string[]): ValidationResult {
    const errors: Record<string, ValidationError> = {};
    let isValid = true;

    for (const fieldName of fieldNames) {
      const rule = this.schema[fieldName];
      if (!rule) continue;

      const value = data[fieldName];
      const error = this.validateField(fieldName, value, rule);
      
      if (error) {
        errors[fieldName] = error;
        isValid = false;
      }
    }

    return {
      isValid,
      errors,
      firstError: Object.values(errors)[0]
    };
  }

  // 헬퍼 메서드들
  private isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }

  private validateType(value: unknown, type: ValidationRule['type']): boolean {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'email':
        return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'url':
        return typeof value === 'string' && this.isValidUrl(value);
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      default:
        return true;
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

// 편의 함수들
export function createValidator(schema: ValidationSchema): Validator {
  return new Validator(schema);
}

export function validateField<T>(
  fieldName: string, 
  value: T, 
  rule: ValidationRule<T>
): ValidationError | null {
  const validator = new Validator({ [fieldName]: rule });
  return validator.validateField(fieldName, value, rule);
}

// 일반적인 검증 규칙들
export const commonRules = {
  email: {
    type: 'email' as const,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 255
  },
  password: {
    type: 'string' as const,
    minLength: 8,
    maxLength: 100,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  },
  url: {
    type: 'url' as const,
    maxLength: 2048
  },
  nickname: {
    type: 'string' as const,
    minLength: 1,
    maxLength: 50,
    pattern: /^[가-힣a-zA-Z0-9_-]+$/
  },
  title: {
    type: 'string' as const,
    minLength: 1,
    maxLength: 200
  },
  description: {
    type: 'string' as const,
    maxLength: 1000
  },
  category: {
    type: 'string' as const,
    minLength: 1,
    maxLength: 50
  },
  tags: {
    type: 'array' as const,
    maxLength: 10,
    custom: (value: unknown) => {
      if (!Array.isArray(value)) return false;
      return value.every(tag => 
        typeof tag === 'string' && 
        tag.length >= 1 && 
        tag.length <= 30
      );
    }
  }
};

// 미리 정의된 검증자들
export const validators = {
  blogPost: createValidator({
    title: { ...commonRules.title, required: true },
    content: { type: 'string', required: true, minLength: 10 },
    category: { ...commonRules.category, required: true },
    excerpt: { type: 'string', maxLength: 300 },
    tags: commonRules.tags
  }),

  resource: createValidator({
    title: { ...commonRules.title, required: true },
    description: commonRules.description,
    category: { ...commonRules.category, required: true },
    tags: commonRules.tags,
    file_type: { type: 'string', required: true }
  }),

  inviteLink: createValidator({
    user_nickname: { ...commonRules.nickname, required: true },
    invite_url: { ...commonRules.url, required: true },
    description: commonRules.description,
    service_name: { type: 'string', required: true, minLength: 1, maxLength: 50 }
  }),

  user: createValidator({
    email: { ...commonRules.email, required: true },
    password: { ...commonRules.password, required: true },
    nickname: { ...commonRules.nickname, required: true }
  })
};