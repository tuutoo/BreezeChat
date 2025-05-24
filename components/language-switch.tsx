"use client"

import * as React from "react"
import { Globe } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { saveLocalePreference } from "@/i18n/config"
import { useLocale } from "@/hooks/use-locale"

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
  usePathname(); // 仅用于触发组件在路由变化时刷新
  const router = useRouter()
  const { locale: pathLocale, getLocalizedPath, t } = useLocale()

  const switchLanguage = (locale: string) => {
    saveLocalePreference(locale);
    const newPath = getLocalizedPath(locale);
    router.push(newPath);
  }

  const currentLocale = pathLocale;
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          aria-label={t('toggleLanguage')}
          title={currentLanguage.name}
          className="px-2 sm:px-3 h-9 relative flex items-center gap-1.5"
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs font-semibold">{currentLocale.toUpperCase()}</span>
          <span className="sr-only">{t('toggleLanguage')}</span>
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
            className={currentLocale === language.code ? "bg-muted" : ""}
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
