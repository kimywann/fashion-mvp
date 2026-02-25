import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * 쿠키/세션 없이 동작하는 공개 서버 클라이언트
 * ISR/SSG 등 정적 생성 시점에 쿠키가 없는 환경에서 사용
 */
export const createPublicServerClient = () =>
  createSupabaseClient(supabaseUrl, supabaseKey);
