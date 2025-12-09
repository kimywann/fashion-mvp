"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/store/slices/userSlice";
import { createClient } from "@/lib/supabase/client";

/**
 * AuthProvider - Supabase 인증 세션을 Redux와 동기화
 *
 * - 앱 시작 시 현재 세션 확인
 * - 로그인/로그아웃 이벤트 감지
 * - Redux user state 자동 업데이트
 */

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const supabase = createClient();

    // 1. 초기 세션 확인 (페이지 로드/새로고침 시)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        dispatch(setUser(session.user));
      } else {
        dispatch(clearUser());
      }
    });

    // 2. 인증 상태 변화 감지 (로그인/로그아웃)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch(setUser(session.user));
      } else {
        dispatch(clearUser());
      }
    });

    // 3. 클린업
    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return <>{children}</>;
}
