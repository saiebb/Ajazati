import * as React from "react"
import { useLanguage } from "@/lib/i18n/client"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, dir, ...props }, ref) => {
    const { isRTL } = useLanguage()
    
    return (
      <input
        type={type}
        dir={dir || (isRTL ? "rtl" : "ltr")}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "[dir='rtl']:text-right [dir='rtl']:placeholder:text-right",
          "[dir='rtl']:file:mr-0 [dir='rtl']:file:ml-2",
          "md:text-sm",
          className
        )}
        ref={ref}
        spellCheck={false}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
