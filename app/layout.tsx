import type React from "react"
import type { Metadata } from "next"
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { MainLayout } from "@/components/layout/main-layout"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/lib/i18n/client"
import { Toaster } from "@/components/ui/toaster"
import { getLocale } from "@/lib/i18n/server"
import { getCurrentUser } from "./auth/actions"

const inter = Inter({ subsets: ["latin"] })
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['arabic'],
})

export const metadata: Metadata = {
  title: "Vacation Manager",
  description: "Manage your team's vacation requests efficiently",
  generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const fontClass = locale === "ar" ? ibmPlexSansArabic.className : inter.className
  const user = await getCurrentUser()

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className={fontClass}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LanguageProvider initialLocale={locale}>
            <MainLayout user={user}>
              {children}
            </MainLayout>
            <SpeedInsights />
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}