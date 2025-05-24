"use client"

import React, { createContext, useContext } from "react"
import { usePathname, useRouter } from "next/navigation"
import { defaultLocale, locales, saveLocalePreference } from "@/i18n/config"

type LanguageContextType = {
  locale: string
  setLocale: (locale: string) => void
}

const LanguageContext = createContext<LanguageContextType>({
  locale: defaultLocale,
  setLocale: () => {}
})

export const useLanguage = () => useContext(LanguageContext)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  // Extract current locale from pathname
  const pathnameLocale = pathname.split('/')[1]
  const isValidLocale = locales.includes(pathnameLocale)
  const locale = isValidLocale ? pathnameLocale : defaultLocale

  const setLocale = (newLocale: string) => {
    if (!locales.includes(newLocale)) return
    saveLocalePreference(newLocale)
    document.cookie = `preferred-locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
    let newPath = ''
    if (isValidLocale) {
      // Replace the current locale segment with the new one
      const segments = pathname.split('/')
      segments[1] = newLocale
      newPath = segments.join('/')
    } else {
      // Add locale prefix to current path
      newPath = `/${newLocale}${pathname}`
    }
    router.push(newPath)
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}
