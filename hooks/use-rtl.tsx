"use client"

import { useLanguage } from "@/lib/i18n/client"

export function useIsRTL() {
  const { isRTL } = useLanguage()
  return isRTL
}