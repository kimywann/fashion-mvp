import { Footer, Header } from "@/components/layout";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="m-6 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
