import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "星光唤醒 - 星空益智游戏",
  description: "一个简单有趣的星空益智游戏，目标是点亮所有的星星",
  keywords: ["星光游戏", "星空游戏", "益智游戏", "starlight game", "puzzle game", "next.js"],
};

// 添加viewport配置，优化移动设备显示
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1.5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#0b0f1d"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b0f1d] text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
