"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn, calculateVacationDays } from "@/lib/utils"
import { createVacationAction } from "./action"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from "@/hooks/use-translations"

export default function AddVacationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [vacationType, setVacationType] = useState<string>("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [notes, setNotes] = useState<string>("")
  const [daysCount, setDaysCount] = useState(0)
  const { t } = useTranslations()

  // Calculate vacation days when dates change
  useState(() => {
    if (startDate && endDate) {
      const days = calculateVacationDays(startDate, endDate)
      setDaysCount(days)
    }
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!vacationType || !startDate || !endDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("vacationType", vacationType)
    formData.append("startDate", startDate.toISOString())
    formData.append("endDate", endDate.toISOString())
    formData.append("notes", notes)

    try {
      const result = await createVacationAction(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })

        // Redirect to home page
        router.push("/")
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <MainLayout>
      <div className="container max-w-2xl py-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("vacationForm.title")}</CardTitle>
            <CardDescription>{t("vacationForm.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="vacationType">{t("vacationForm.vacationType")}</Label>
                <Select value={vacationType} onValueChange={setVacationType}>
                  <SelectTrigger id="vacationType">
                    <SelectValue placeholder={t("vacationForm.vacationTypeDescription")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">{t("vacationTypes.regular")}</SelectItem>
                    <SelectItem value="2">{t("vacationTypes.casual")}</SelectItem>
                    <SelectItem value="3">{t("vacationTypes.sick")}</SelectItem>
                    <SelectItem value="4">{t("vacationTypes.personal")}</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">{t("vacationForm.vacationTypeDescription")}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate">{t("vacationForm.startDate")}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="startDate"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        {startDate ? format(startDate, "PPP") : <span>{t("vacationForm.pickDate")}</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">{t("vacationForm.endDate")}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="endDate"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground",
                        )}
                      >
                        {endDate ? format(endDate, "PPP") : <span>{t("vacationForm.pickDate")}</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => date < (startDate || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {startDate && endDate && (
                <div className="bg-muted p-3 rounded-md text-sm">
                  {t("vacationForm.requestingDays", `You are requesting ${daysCount} working day(s) of vacation.`).replace("{days}", daysCount.toString())}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">{t("vacationForm.notes")}</Label>
                <Textarea
                  id="notes"
                  placeholder={t("vacationForm.notesPlaceholder")}
                  className="resize-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <CardFooter className="px-0 pb-0">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t("vacationForm.submitting", "Submitting...") : t("vacationForm.submitRequest", "Submit Request")}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
