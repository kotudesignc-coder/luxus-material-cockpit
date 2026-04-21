import type { Metadata } from "next";
import { Noto_Serif_TC, Noto_Sans_TC, Inter } from "next/font/google";
import "./globals.css";

const notoSerifTC = Noto_Serif_TC({
  variable: "--font-serif-tc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-sans-tc",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI 選材 — 為設計師與油漆師傅打造",
  description:
    "30 秒把顏色鋪到你家的牆上，看過再決定。LUXUS × RoomDreaming × 可塗設計 共同推出的 AI 選材教學駕駛艙。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`${notoSerifTC.variable} ${notoSansTC.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-sans-tc)]">
        {children}
      </body>
    </html>
  );
}
