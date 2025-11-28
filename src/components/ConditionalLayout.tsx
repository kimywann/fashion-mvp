"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSideBar from "@/components/AdminSideBar";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="flex min-h-screen">
        <AdminSideBar />
        <main className="ml-64 flex-1 p-6">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="m-6 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
