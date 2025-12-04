"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { clearUser } from "@/store/slices/userSlice";

import { Heart, LogIn, LogOut, ShoppingCart, User } from "lucide-react";

export const Header = () => {
  const supabase = createClient();

  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const handleLogout = () => {
    dispatch(clearUser());
    supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="m-3 flex justify-between">
      <Link href="/">
        <img src="/images/logo.svg" alt="로고" className="w-40" />
      </Link>
      <ul className="m-3 flex gap-4">
        <li aria-label="좋아요">
          <Link href="/like">
            <Heart />
          </Link>
        </li>
        <li aria-label="장바구니">
          <Link href="/cart">
            <ShoppingCart />
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
