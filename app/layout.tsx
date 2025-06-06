import type { Metadata } from "next";
import { GoogleAnalytics } from '@next/third-parties/google'
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider"
import { ActiveThemeProvider } from "@/components/active-theme"
import { cookies } from "next/headers";
import { fontVariables } from "@/lib/fonts";
import { cn } from "@/lib/utils";

import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from 'next/font/google'
import { notoSansMono } from './fonts'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "BreezeChat - AI智能对话助手",
  description: "BreezeChat 智能AI对话助手，支持多场景风格切换",
  keywords: ['BreezeChat', 'AI对话', 'AI Chat', '多场景对话'],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'BreezeChat - AI智能对话助手',
    description: 'BreezeChat 智能AI对话助手，支持多场景风格切换',
    url: 'https://breezechat.sohot.app',
    siteName: 'BreezeChat',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'BreezeChat - AI智能对话助手',
    description: '智能AI对话助手，支持多场景风格切换',
  }
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params?: Promise<{ locale?: string }>;
}>) {
  const cookieStore = await cookies()
  const activeThemeValue = cookieStore.get("active_theme")?.value
  const isScaled = activeThemeValue?.endsWith("-scaled")
  const resolvedParams = params ? await params : undefined
  const locale = resolvedParams?.locale || "en"

  return (
    <html lang={locale} suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${inter.className} ${notoSansMono.variable} bg-background overscroll-none font-sans antialiased`}>
      <body
        className={cn(
          activeThemeValue ? `theme-${activeThemeValue}` : "",
          isScaled ? "theme-scaled" : "",
          fontVariables
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <ActiveThemeProvider initialTheme={activeThemeValue}>
            {children}
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
          </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
