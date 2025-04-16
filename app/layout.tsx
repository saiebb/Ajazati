import type React from "react"
import type { Metadata } from "next"
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/lib/i18n/client"
import { getLocale } from "@/lib/i18n/server"

const inter = Inter({ subsets: ["latin"] })
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['arabic'],
})

export const metadata: Metadata = {
  title: "Jazati - My Vacation",
  description: "Manage your vacation days efficiently",
  generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const fontClass = locale === "ar" ? ibmPlexSansArabic.className : inter.className

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className={fontClass}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LanguageProvider initialLocale={locale}>
            {children}
            <SpeedInsights />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}