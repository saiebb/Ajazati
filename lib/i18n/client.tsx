"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { setCookie, getCookie } from "cookies-next"
import { type Locale, defaultLocale, locales, getDirection } from "./config"

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  direction: "ltr" | "rtl"
  isRTL: boolean
}

const LanguageContext = React.createContext<LanguageContextType>({
  locale: defaultLocale,
  setLocale: () => {},
  direction: "ltr",
  isRTL: false,
})

export const useLanguage = () => React.useContext(LanguageContext)

interface LanguageProviderProps {
  children: React.ReactNode
  initialLocale?: Locale
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, initialLocale = defaultLocale }) => {
  const router = useRouter()
  const [locale, setLocaleState] = React.useState<Locale>(initialLocale)
  const direction = getDirection(locale)
  const isRTL = direction === "rtl"

  React.useEffect(() => {
    const storedLocale = getCookie("locale") as Locale | undefined
    if (storedLocale && locales.includes(storedLocale)) {
      setLocaleState(storedLocale)
    } else {
      const browserLocale = detectBrowserLocale()
      if (browserLocale && browserLocale !== locale) {
        setLocaleState(browserLocale)
      }
    }
  }, [locale])

  React.useEffect(() => {
    document.documentElement.dir = direction
    document.documentElement.lang = locale
  }, [locale, direction])

  const setLocale = (newLocale: Locale) => {
    if (newLocale !== locale && locales.includes(newLocale)) {
      setLocaleState(newLocale)
      setCookie("locale", newLocale, { maxAge: 60 * 60 * 24 * 365 })
      router.refresh()
    }
  }

  const detectBrowserLocale = (): Locale | undefined => {
    if (typeof window === "undefined") return undefined
    const browserLang = navigator.language.split("-")[0]
    return locales.find((locale) => locale === browserLang) as Locale | undefined
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, direction, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
}
