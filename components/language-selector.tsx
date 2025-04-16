"use client"

import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslations } from "@/hooks/use-translations"
import { useLanguage } from "@/lib/i18n/client"

export interface LanguageSelectorProps {
  language?: string
  onLanguageChange: (language: "en" | "ar") => void
}

export function LanguageSelector({ language = "en", onLanguageChange }: LanguageSelectorProps) {
  const { t } = useTranslations()
  const { setLocale } = useLanguage()

  const handleLanguageChange = (newLanguage: "en" | "ar") => {
    setLocale(newLanguage)
    onLanguageChange(newLanguage)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t("language.change")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
          {t("language.english")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange("ar")}>
          {t("language.arabic")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
