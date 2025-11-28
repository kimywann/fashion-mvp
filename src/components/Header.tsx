import { Heart, ShoppingCart, User } from "lucide-react";
import Link from "next/link";

export default function Header() {
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
        <li aria-label="프로필">
          <Link href="/signup">
            <User />
          </Link>
        </li>
      </ul>
    </header>
  );
}
