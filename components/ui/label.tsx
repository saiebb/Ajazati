"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { useLanguage } from "@/lib/i18n/client"
import { cn } from "@/lib/utils"

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, dir, ...props }, ref) => {
  const { isRTL } = useLanguage()
  
  return (
    <LabelPrimitive.Root
      ref={ref}
      dir={dir || (isRTL ? "rtl" : "ltr")}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        "[dir='rtl']:text-right [dir='rtl']:self-start",
        className
      )}
      {...props}
    />
  )
})
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
