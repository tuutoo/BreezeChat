"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "./use-locale";

export function useLocalizedNavigation() {
  const router = useRouter();
  const { locale, getLocalizedPath } = useLocale();

  /**
   * Navigate to a path while preserving the current locale
   * @param path - The path to navigate to (without locale prefix)
   */
  const navigateTo = (path: string) => {
    // If the path already includes a locale, use it directly
    if (path.match(/^\/[a-z]{2}(\/|$)/)) {
      router.push(path);
      return;
    }

    // Otherwise, add the current locale as prefix
    const localizedPath = getLocalizedPath(locale);
    const pathWithoutLeadingSlash = path.startsWith("/")
      ? path.substring(1)
      : path;

    router.push(`/${locale}/${pathWithoutLeadingSlash}`);
  };

  /**
   * Navigate to a path with a specific locale
   * @param path - The path to navigate to (without locale prefix)
   * @param targetLocale - The locale to use
   */
  const navigateWithLocale = (path: string, targetLocale: string) => {
    const pathWithoutLeadingSlash = path.startsWith("/")
      ? path.substring(1)
      : path;
    router.push(`/${targetLocale}/${pathWithoutLeadingSlash}`);
  };

  return {
    navigateTo,
    navigateWithLocale,
  };
}
