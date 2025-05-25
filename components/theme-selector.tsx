"use client"

import { THEMES } from "@/lib/themes"
import { useThemeConfig } from "./active-theme"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslations } from 'next-intl'

export function ThemeSelector() {
  const { activeTheme, setActiveTheme } = useThemeConfig()
  const t = useTranslations()

  return (
    <Select value={activeTheme} onValueChange={setActiveTheme}>
      <SelectTrigger size="sm" className="w-32">
        <SelectValue placeholder={t('pageTheme.selectTheme')} />
      </SelectTrigger>
      <SelectContent align="end">
        {THEMES.map((theme) => (
          <SelectItem key={theme.value} value={theme.value}>
            {t(`pageTheme.${theme.value}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}