"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { clearUser } from "@/store/slices/userSlice";

import { LogIn, LogOut, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";

export const Header = () => {
  const supabase = createClient();

  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const nickname = useSelector((state: RootState) => state.user.nickname);
  const { items } = useCart();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1) Supabase 로그아웃
      await supabase.auth.signOut();

      // 2) Redux user 상태 초기화
      dispatch(clearUser());

      // 3) 서버 세션을 다시 읽도록 강제 refresh
      router.refresh();

      // 4) 페이지 이동
      router.replace("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="m-3 flex justify-between">
      <Link href="/">
        <img src="/images/logo.svg" alt="로고" className="w-40" />
      </Link>
      <ul className="m-3 flex gap-4">
        {isAuthenticated && (
          <li aria-label="닉네임">{nickname}님 환영합니다.</li>
        )}
        <li aria-label="장바구니" className="relative">
          <Link href="/cart" className="relative inline-block">
            <ShoppingCart />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-2 rounded-full bg-red-500 px-1 text-xs text-white">
                {items.length}
              </span>
            )}
          </Link>
        </li>
        {!isAuthenticated ? (
          <li aria-label="로그인">
            <Link href="/login">
              <LogIn />
            </Link>
          </li>
        ) : (
          <li aria-label="로그아웃">
            <button onClick={handleLogout} className="cursor-pointer">
              <LogOut />
            </button>
          </li>
        )}
        <li aria-label="프로필">
          <Link href="/profile">
            <User />
          </Link>
        </li>
      </ul>
    </header>
  );
};
