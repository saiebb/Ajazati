import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInDays, format, isWeekend } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return format(dateObj, "MMM dd, yyyy")
}

export function calculateVacationDays(startDate: Date, endDate: Date, excludeWeekends = true): number {
  const start = new Date(startDate)
  const end = new Date(endDate)

  let days = differenceInDays(end, start) + 1

  if (excludeWeekends) {
    const currentDate = new Date(start)
    let weekendDays = 0

    while (currentDate <= end) {
      if (isWeekend(currentDate)) {
        weekendDays++
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    days -= weekendDays
  }

  return days
}

export function getVacationTypeColor(typeId: number): string {
  const colors: Record<number, string> = {
    1: "#4CAF50", // Regular
    2: "#ADD8E6", // Casual
    3: "#FF8A65", // Sick
    4: "#9C27B0", // Personal
    5: "#FFC107", // Public Holiday
  }

  return colors[typeId] || "#4CAF50"
}
