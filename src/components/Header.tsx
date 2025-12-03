import { Heart, LogIn, LogOut, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/slices/userSlice";
import { AppDispatch } from "@/store";

export default function Header() {
  const supabase = createClient();
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const handleLogout = () => {
    dispatch(clearUser());
    supabase.auth.signOut();
    router.push("/");
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
}
