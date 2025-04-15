"use client"

import { useCallback } from "react"
import { useLanguage } from "@/lib/i18n/client"
import type { Locale } from "@/lib/i18n/config"

// Import all message files
import enMessages from "@/lib/i18n/messages/en.json"
import arMessages from "@/lib/i18n/messages/ar.json"

type MessageDictionary = {
  [key: string]: string | MessageDictionary
}

type Messages = Record<Locale, MessageDictionary>

const messages: Messages = {
  en: enMessages as MessageDictionary,
  ar: arMessages as MessageDictionary,
}

export function useTranslations() {
  const { locale } = useLanguage()

  const t = useCallback(
    (key: string, defaultMessage?: string) => {
      const keys = key.split(".")
      let result: string | MessageDictionary = messages[locale as keyof Messages]

      for (const k of keys) {
        if (result && typeof result === "object" && k in result) {
          result = result[k]
        } else {
          return defaultMessage || key
        }
      }

      return typeof result === "string" ? result : defaultMessage || key
    },
    [locale],
  )

  return { t }
}
