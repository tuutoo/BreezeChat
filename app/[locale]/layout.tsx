'use client';

import "../globals.css"
import { LanguageProvider } from "@/components/language-provider"
import { Toaster } from "@/components/ui/toaster"
import { locales } from "@/i18n/config";
import React from "react";

export default function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string } | Promise<{ locale: string }>;
}) {
  // Use React.use() for the params
  let locale: string;

  if (params instanceof Promise || (typeof params === 'object' && params !== null && 'then' in params)) {
    const resolvedParams = React.use(params as Promise<{ locale: string }>);
    locale = resolvedParams.locale;
  } else {
    locale = (params as { locale: string }).locale;
  }

  const isValidLocale = locales.includes(locale);

  if (!isValidLocale) {
    // This shouldn't happen due to middleware, but just in case
    return null;
  }

  return (
    <LanguageProvider>
      {children}
      <Toaster />
    </LanguageProvider>
  )
}
