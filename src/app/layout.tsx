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
  title: "Lights-On 益智游戏",
  description: "一个简单有趣的益智游戏，目标是点亮所有的灯",
  keywords: ["灯光游戏", "益智游戏", "lights-out", "puzzle game", "next.js"],
};

// 添加viewport配置，优化移动设备显示
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1.5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#1a1a2e"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
