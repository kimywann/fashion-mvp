import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/lib/ReduxProvider";
import AuthProvider from "@/lib/AuthProvider";
import QueryProvider from "@/lib/QueryProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Fashion MVP",
    template: "%s | Fashion MVP",
  },
  description: "패션 상품을 탐색하고 구매할 수 있는 쇼핑몰 MVP",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "Fashion MVP",
    title: "Fashion MVP",
    description: "패션 상품을 탐색하고 구매할 수 있는 쇼핑몰 MVP",
    url: "/",
    images: [{ url: "/images/home.png" }, { url: "/images/logo.svg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fashion MVP",
    description: "패션 상품을 탐색하고 구매할 수 있는 쇼핑몰 MVP",
    images: ["/images/home.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <AuthProvider>
            <QueryProvider>
              {children}
              <Toaster richColors position="top-center" />
            </QueryProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
