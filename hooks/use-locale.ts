"use client";

import { usePathname } from "next/navigation";
import {
  defaultLocale,
  locales,
  translations,
  getTranslation,
  formatDate,
  formatNumber,
  formatRelativeTime,
} from "@/i18n/config";

export function useLocale() {
  const pathname = usePathname();

  // Extract locale from pathname
  const pathnameLocale = pathname.split("/")[1];
  const currentLocale = locales.includes(pathnameLocale)
    ? pathnameLocale
    : defaultLocale;

  // Create a type-safe t function for getting translations
  const t = (key: keyof (typeof translations)[typeof defaultLocale]) => {
    return getTranslation(currentLocale, key);
  };

  // Get path without locale prefix
  const getPathWithoutLocale = () => {
    const segments = pathname.split("/");
    return segments.length > 2 ? "/" + segments.slice(2).join("/") : "/";
  };

  // Generate path for a specific locale
  const getLocalizedPath = (targetLocale: string) => {
    if (!locales.includes(targetLocale)) return pathname;

    const pathWithoutLocale = getPathWithoutLocale();
    return `/${targetLocale}${
      pathWithoutLocale === "/" ? "" : pathWithoutLocale
    }`;
  };

  // Date formatting with current locale
  const formatLocalDate = (
    date: Date,
    options?: Intl.DateTimeFormatOptions
  ) => {
    return formatDate(date, currentLocale, options);
  };

  // Number formatting with current locale
  const formatLocalNumber = (
    number: number,
    options?: Intl.NumberFormatOptions
  ) => {
    return formatNumber(number, currentLocale, options);
  };

  // Relative time formatting with current locale
  const formatLocalRelativeTime = (
    value: number,
    unit: Intl.RelativeTimeFormatUnit
  ) => {
    return formatRelativeTime(value, unit, currentLocale);
  };

  return {
    locale: currentLocale,
    t,
    getLocalizedPath,
    locales,
    getPathWithoutLocale,
    formatLocalDate,
    formatLocalNumber,
    formatLocalRelativeTime,
  };
}
