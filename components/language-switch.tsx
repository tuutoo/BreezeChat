"use client"

import * as React from "react"
import { Globe } from "lucide-react"
import { useRouter, usePathname } from "@/i18n/routing"
import { useLocale } from "next-intl"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
]

export function LanguageSwitch() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations()

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  }

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          aria-label={t('header.toggleLanguage')}
          title={currentLanguage.name}
          className="px-2 sm:px-3 h-9 relative flex items-center gap-1.5"
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs font-semibold">{currentLanguage.nativeName}</span>
          <span className="sr-only">{t('header.toggleLanguage')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex items-center gap-2">
          {currentLanguage.flag} {currentLanguage.nativeName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => switchLanguage(language.code)}
            className={locale === language.code ? "bg-muted" : ""}
          >
            <span className="mr-2">{language.flag}</span>
            <span>{language.nativeName}</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {language.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
