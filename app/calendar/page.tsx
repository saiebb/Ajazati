"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { addDays, format, getMonth, getYear, isSameDay, parseISO } from "date-fns"
import { useTranslations } from "@/hooks/use-translations"

// This would normally come from an API
const mockVacations = [
  {
    id: "1",
    start_date: "2024-05-10",
    end_date: "2024-05-15",
    vacation_type_id: 1,
    status: "approved",
  },
  {
    id: "2",
    start_date: "2024-06-20",
    end_date: "2024-06-20",
    vacation_type_id: 2,
    status: "pending",
  },
  {
    id: "3",
    start_date: "2024-07-05",
    end_date: "2024-07-07",
    vacation_type_id: 3,
    status: "pending",
  },
]

const vacationTypeColors: Record<number, string> = {
  1: "#4CAF50", // Regular
  2: "#ADD8E6", // Casual
  3: "#FF8A65", // Sick
  4: "#9C27B0", // Personal
  5: "#FFC107", // Public Holiday
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [year, setYear] = useState<number>(getYear(new Date()))
  const [month, setMonth] = useState<number>(getMonth(new Date()))
  const { t } = useTranslations()

  // Generate all dates that have vacations
  const vacationDates = mockVacations.flatMap((vacation) => {
    const dates: Date[] = []
    const start = parseISO(vacation.start_date)
    const end = parseISO(vacation.end_date)

    let current = start
    while (current <= end) {
      dates.push(new Date(current))
      current = addDays(current, 1)
    }

    return dates.map((date) => ({
      date,
      typeId: vacation.vacation_type_id,
      status: vacation.status,
    }))
  })

  // Find vacations for the selected date
  const selectedDateVacations = mockVacations.filter((vacation) => {
    const start = parseISO(vacation.start_date)
    const end = parseISO(vacation.end_date)
    return date >= start && date <= end
  })

  // Years for the select
  const years = Array.from({ length: 5 }, (_, i) => getYear(new Date()) + i - 2)

  // Months for the select
  const months = [
    t("calendar.january", "January"),
    t("calendar.february", "February"),
    t("calendar.march", "March"),
    t("calendar.april", "April"),
    t("calendar.may", "May"),
    t("calendar.june", "June"),
    t("calendar.july", "July"),
    t("calendar.august", "August"),
    t("calendar.september", "September"),
    t("calendar.october", "October"),
    t("calendar.november", "November"),
    t("calendar.december", "December"),
  ]

  return (
    <MainLayout>
      <div className="container py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold">{t("calendar.title", "Vacation Calendar")}</h1>

          <div className="flex gap-2">
            <Select value={year.toString()} onValueChange={(value) => setYear(Number.parseInt(value))}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={t("calendar.year", "Year")} />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={month.toString()} onValueChange={(value) => setMonth(Number.parseInt(value))}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={t("calendar.month", "Month")} />
              </SelectTrigger>
              <SelectContent>
                {months.map((m, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t("calendar.calendarView", "Calendar View")}</CardTitle>
              <CardDescription>{t("calendar.calendarDescription", "View and manage your vacation days")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                month={new Date(year, month)}
                onMonthChange={(date) => {
                  setMonth(getMonth(date))
                  setYear(getYear(date))
                }}
                className="rounded-md border"
                modifiers={{
                  vacation: vacationDates.map((v) => v.date),
                }}
                modifiersStyles={{
                  vacation: {
                    fontWeight: "bold",
                  },
                }}
                components={{
                  DayContent: ({ date, displayMonth, ...props }) => {
                    // Extract React-specific props that shouldn't be passed to DOM elements
                    // Use type assertion to handle the props that TypeScript doesn't recognize
                    const { className, style, activeModifiers, ...domProps } = props as React.HTMLAttributes<HTMLDivElement> & { activeModifiers: any };
                    const matchingVacations = vacationDates.filter((v) => isSameDay(v.date, date))

                    if (matchingVacations.length === 0) {
                      return <div {...domProps}>{date.getDate()}</div>
                    }

                    return (
                      <div {...domProps} className="relative w-full h-full flex items-center justify-center">
                        {date.getDate()}
                        <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-0.5">
                          {matchingVacations.map((vacation, i) => (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                backgroundColor: vacationTypeColors[vacation.typeId],
                                opacity: vacation.status === "pending" ? 0.6 : 1,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )
                  },
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{format(date, "MMMM d, yyyy")}</CardTitle>
              <CardDescription>
                {selectedDateVacations.length > 0
                  ? t("calendar.vacationDetailsForDate", "Vacation details for selected date")
                  : t("calendar.noVacationsForDate", "No vacations scheduled for this date.")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDateVacations.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateVacations.map((vacation) => (
                    <div key={vacation.id} className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">
                            {vacation.vacation_type_id === 1
                              ? t("vacationTypes.regular")
                              : vacation.vacation_type_id === 2
                                ? t("vacationTypes.casual")
                                : vacation.vacation_type_id === 3
                                  ? t("vacationTypes.sick")
                                  : vacation.vacation_type_id === 4
                                    ? t("vacationTypes.personal")
                                    : t("vacationTypes.publicHoliday", "Vacation")}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {format(parseISO(vacation.start_date), "MMM d")} -{" "}
                            {format(parseISO(vacation.end_date), "MMM d, yyyy")}
                          </p>
                        </div>
                        <Badge className={vacation.status === "approved" ? "bg-green-500" : "bg-amber-500"}>
                          {t(`vacationStatus.${vacation.status}`, vacation.status.charAt(0).toUpperCase() + vacation.status.slice(1))}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <p>{t("calendar.noVacationsForDate")}</p>
                  <p className="mt-2 text-sm">{t("calendar.selectDateWithIndicator")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
