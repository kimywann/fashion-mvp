import { AdminSideBar } from "@/components/admin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSideBar />
      <main className="ml-64 flex-1 p-6">{children}</main>
    </div>
  );
}
