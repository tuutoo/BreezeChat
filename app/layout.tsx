import type { Metadata } from "next";
import { GoogleAnalytics } from '@next/third-parties/google'
import "./globals.css";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider"
import { ActiveThemeProvider } from "@/components/active-theme"
import { cookies } from "next/headers";
import { fontVariables } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";
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

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params?: { locale?: string };
}>) {
  const cookieStore = await cookies()
  const activeThemeValue = cookieStore.get("active_theme")?.value
  const isScaled = activeThemeValue?.endsWith("-scaled")
  const locale = params?.locale || "en"

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
            <Header></Header>
            <main
              className="
              pt-20
              min-h-[calc(100vh-5rem)]
              flex justify-center  items-center
              px-4
            "
            >
              {children}
            </main>
            <Footer />
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
          </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
