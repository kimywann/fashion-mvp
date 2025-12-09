"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "대시보드",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "상품 등록",
    href: "/admin/product/new",
    icon: Package,
  },
];

export const AdminSideBar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 border-r bg-white shadow-sm">
      <div className="flex h-full flex-col">
        {/* 로고/헤더 */}
        <div className="border-b p-6">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold">관리자</span>
          </Link>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* 하단 링크 */}
        <div className="border-t p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
          >
            <Home className="h-5 w-5" />
            <span>홈으로</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};
