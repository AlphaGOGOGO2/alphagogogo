/**
 * Supabase Client - DEPRECATED (로컬 모드 전용 프로젝트)
 *
 * 이 프로젝트는 현재 로컬 모드로 운영됩니다.
 * Supabase는 더 이상 사용되지 않으며, 모든 기능은 로컬 데이터로 대체되었습니다.
 *
 * 레거시 코드 호환성을 위해 파일은 유지하지만 실제로 사용하지 마세요.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// DEPRECATED: 더 이상 사용되지 않는 Supabase 클라이언트
const SUPABASE_URL = "https://plimzlmmftdbpipbnhsy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsaW16bG1tZnRkYnBpcGJuaHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyOTI0MDYsImV4cCI6MjA1Njg2ODQwNn0.ec1TFcDqzfnaO2VEPhBgA_0OhjVHMxMoSdrrxJ2Kyi4";

// 레거시 호환성을 위한 클라이언트 (사용 금지)
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);