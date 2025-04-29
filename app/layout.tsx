import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google'
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
  title: "LinguaLens 翻译助手",
  description: "LinguaLens 智能双向翻译助手，支持多场景风格切换",
  keywords: ['LinguaLens', '翻译', 'AI 翻译', '多场景翻译'],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'LinguaLens 翻译助手',
    description: 'LinguaLens 智能双向翻译助手，支持多场景风格切换',
    url: 'https://lingualens.blazorserver.com',
    siteName: 'LinguaLens',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'LinguaLens 翻译助手',
    description: '智能双向翻译助手，支持多场景风格切换',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}
