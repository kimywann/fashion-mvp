import { AdminSideBar } from "@/components/admin";

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
