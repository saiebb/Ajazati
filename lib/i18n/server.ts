import { createIntl } from "@formatjs/intl"
import { cookies, headers } from "next/headers"
import { locales, defaultLocale, type Locale } from "./config"

// Import all message files
import enMessages from "./messages/en.json"
import arMessages from "./messages/ar.json"

const messages: Record<Locale, Record<string, any>> = {
  en: enMessages,
  ar: arMessages,
}

export async function getLocale(): Promise<Locale> {
  try {
    // First check cookies
    const cookieStore = await cookies()
    const localeCookie = cookieStore.get("locale")?.value as Locale | undefined

    if (localeCookie && locales.includes(localeCookie)) {
      return localeCookie
    }

    // Then check Accept-Language header
    const headersList = await headers()
    const acceptLanguage = headersList.get("Accept-Language")

    if (acceptLanguage) {
      // Parse the Accept-Language header
      const browserLocales = acceptLanguage.split(",").map((lang: string) => lang.split(";")[0].trim().substring(0, 2))

      // Find the first locale that matches our supported locales
      const matchedLocale = browserLocales.find((locale: string) => locales.includes(locale as Locale)) as Locale | undefined

      if (matchedLocale) {
        return matchedLocale
      }
    }

    // Default fallback
    return defaultLocale
  } catch (error) {
    console.error("Error getting locale:", error)
    return defaultLocale
  }
}

export async function getTranslations(locale: Locale = defaultLocale) {
  const intl = createIntl({
    locale: locale,
    messages: messages[locale] || messages[defaultLocale],
  })

  return {
    t: (id: string, values?: Record<string, any>) => {
      try {
        return intl.formatMessage({ id }, values)
      } catch (error) {
        console.error(`Translation missing for: ${id}`)
        return id
      }
    },
  }
}
