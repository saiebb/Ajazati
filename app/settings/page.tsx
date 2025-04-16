"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Calendar, Globe, User, Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/lib/i18n/client"
import { localeNames, type Locale } from "@/lib/i18n/config"
import { useTranslations } from "@/hooks/use-translations"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const { theme, setTheme } = useTheme()
  const { locale, setLocale } = useLanguage()
  const { t } = useTranslations()

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  return (
    <MainLayout>
      <div className="container py-6 space-y-6">
        <h1 className="text-2xl font-bold">{t("settings.title", "Settings")}</h1>

        <Tabs defaultValue="profile" className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{t("settings.profile", "Profile")}</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">{t("settings.notifications", "Notifications")}</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{t("settings.preferences", "Preferences")}</span>
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">{t("settings.integrations", "Integrations")}</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.profileInformation", "Profile Information")}</CardTitle>
                <CardDescription>
                  {t("settings.profileDescription", "Update your personal information")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("settings.fullName", "Full Name")}</Label>
                    <Input id="name" defaultValue="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("settings.emailAddress", "Email Address")}</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job-title">{t("settings.jobTitle", "Job Title")}</Label>
                  <Input id="job-title" defaultValue="Software Engineer" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">{t("settings.department", "Department")}</Label>
                  <Select defaultValue="engineering">
                    <SelectTrigger id="department">
                      <SelectValue placeholder={t("settings.selectDepartment", "Select department")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? t("settings.saving", "Saving...") : t("settings.saveChanges", "Save Changes")}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("settings.vacationAllowance", "Vacation Allowance")}</CardTitle>
                <CardDescription>
                  {t("settings.vacationAllowanceDescription", "Manage your annual vacation days")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="total-days">{t("settings.totalVacationDays", "Total Vacation Days")}</Label>
                  <Input id="total-days" type="number" defaultValue="21" />
                  <p className="text-sm text-muted-foreground">
                    {t("settings.totalVacationDaysDescription", "This is your annual vacation allowance.")}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reset-date">{t("settings.resetDate", "Reset Date")}</Label>
                  <Select defaultValue="january">
                    <SelectTrigger id="reset-date">
                      <SelectValue placeholder={t("settings.selectMonth", "Select month")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="january">January 1st</SelectItem>
                      <SelectItem value="april">April 1st</SelectItem>
                      <SelectItem value="july">July 1st</SelectItem>
                      <SelectItem value="october">October 1st</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.resetDateDescription", "Your vacation days will reset on this date each year.")}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? t("settings.saving", "Saving...") : t("settings.saveChanges", "Save Changes")}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.appPreferences", "App Preferences")}</CardTitle>
                <CardDescription>
                  {t("settings.appPreferencesDescription", "Customize your app experience")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">{t("settings.display", "Display")}</h3>
                  <Separator />

                  <div className="space-y-4">
                    <Label>{t("settings.language", "Language")}</Label>
                    <RadioGroup
                      value={locale}
                      onValueChange={(value) => setLocale(value as Locale)}
                      className="grid gap-4"
                    >
                      {Object.entries(localeNames).map(([code, name]) => (
                        <div key={code} className="flex items-center space-x-2">
                          <RadioGroupItem value={code} id={`lang-${code}`} />
                          <Label htmlFor={`lang-${code}`} className="flex items-center gap-2">
                            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                              {code.toUpperCase()}
                            </span>
                            <div>
                              <div className="font-medium">{name}</div>
                              <div className="text-sm text-muted-foreground">
                                {code === "en" ? "Left to Right" : "Right to Left"}
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-4 mt-6">
                    <Label>{t("settings.theme", "Theme")}</Label>
                    <RadioGroup value={theme || "system"} onValueChange={setTheme} className="grid gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="theme-light" />
                        <Label htmlFor="theme-light" className="flex items-center gap-2">
                          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Sun className="h-5 w-5" />
                          </span>
                          <div>
                            <div className="font-medium">{t("settings.lightMode", "Light Mode")}</div>
                            <div className="text-sm text-muted-foreground">
                              {t("settings.lightModeDescription", "Bright theme for daytime use")}
                            </div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="theme-dark" />
                        <Label htmlFor="theme-dark" className="flex items-center gap-2">
                          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Moon className="h-5 w-5" />
                          </span>
                          <div>
                            <div className="font-medium">{t("settings.darkMode", "Dark Mode")}</div>
                            <div className="text-sm text-muted-foreground">
                              {t("settings.darkModeDescription", "Dark theme for nighttime use")}
                            </div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="theme-system" />
                        <Label htmlFor="theme-system" className="flex items-center gap-2">
                          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Monitor className="h-5 w-5" />
                          </span>
                          <div>
                            <div className="font-medium">{t("settings.systemTheme", "System Theme")}</div>
                            <div className="text-sm text-muted-foreground">
                              {t("settings.systemThemeDescription", "Follow your system preferences")}
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">{t("settings.calendarSettings", "Calendar")}</h3>
                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="first-day">{t("settings.firstDayOfWeek", "First Day of Week")}</Label>
                    <Select defaultValue="sunday">
                      <SelectTrigger id="first-day">
                        <SelectValue placeholder={t("settings.selectDay", "Select day")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunday">Sunday</SelectItem>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="saturday">Saturday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weekend-days">{t("settings.includeWeekendDays", "Include Weekend Days")}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t("settings.includeWeekendDaysDescription", "Count weekend days in vacation calculations")}
                      </p>
                    </div>
                    <Switch id="weekend-days" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? t("settings.saving", "Saving...") : t("settings.saveChanges", "Save Changes")}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.notificationSettings", "Notification Settings")}</CardTitle>
                <CardDescription>
                  {t("settings.notificationDescription", "Manage how you receive notifications")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">{t("settings.emailNotifications", "Email Notifications")}</h3>
                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="vacation-approved">{t("settings.vacationApproved", "Vacation Approved")}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t(
                          "settings.vacationApprovedDescription",
                          "Receive an email when your vacation request is approved",
                        )}
                      </p>
                    </div>
                    <Switch id="vacation-approved" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="vacation-rejected">{t("settings.vacationRejected", "Vacation Rejected")}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t(
                          "settings.vacationRejectedDescription",
                          "Receive an email when your vacation request is rejected",
                        )}
                      </p>
                    </div>
                    <Switch id="vacation-rejected" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="vacation-reminder">{t("settings.vacationReminders", "Vacation Reminders")}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t(
                          "settings.vacationRemindersDescription",
                          "Receive a reminder email before your vacation starts",
                        )}
                      </p>
                    </div>
                    <Switch id="vacation-reminder" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="balance-notification">
                        {t("settings.balanceNotifications", "Balance Notifications")}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t(
                          "settings.balanceNotificationsDescription",
                          "Receive notifications when your vacation balance is running low",
                        )}
                      </p>
                    </div>
                    <Switch id="balance-notification" defaultChecked />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">{t("settings.inAppNotifications", "In-App Notifications")}</h3>
                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="status-updates">{t("settings.statusUpdates", "Status Updates")}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t(
                          "settings.statusUpdatesDescription",
                          "Receive notifications for vacation request status changes",
                        )}
                      </p>
                    </div>
                    <Switch id="status-updates" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="upcoming-vacations">
                        {t("settings.upcomingVacations", "Upcoming Vacations")}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t("settings.upcomingVacationsDescription", "Receive reminders about your upcoming vacations")}
                      </p>
                    </div>
                    <Switch id="upcoming-vacations" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? t("settings.saving", "Saving...") : t("settings.saveChanges", "Save Changes")}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.calendarIntegrations", "Calendar Integrations")}</CardTitle>
                <CardDescription>
                  {t("settings.calendarIntegrationsDescription", "Connect your calendar to sync vacation days")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="google-calendar">{t("settings.googleCalendar", "Google Calendar")}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t("settings.googleCalendarDescription", "Sync your vacations with Google Calendar")}
                      </p>
                    </div>
                    <Switch id="google-calendar" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="outlook-calendar">{t("settings.outlookCalendar", "Outlook Calendar")}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t("settings.outlookCalendarDescription", "Sync your vacations with Outlook Calendar")}
                      </p>
                    </div>
                    <Switch id="outlook-calendar" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="apple-calendar">{t("settings.appleCalendar", "Apple Calendar")}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t("settings.appleCalendarDescription", "Sync your vacations with Apple Calendar")}
                      </p>
                    </div>
                    <Switch id="apple-calendar" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">{t("settings.exportOptions", "Export Options")}</h3>
                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="export-format">{t("settings.exportFormat", "Export Format")}</Label>
                    <Select defaultValue="ics">
                      <SelectTrigger id="export-format">
                        <SelectValue placeholder={t("settings.selectFormat", "Select format")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ics">ICS (iCalendar)</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="outline" className="w-full">
                    {t("settings.exportVacationData", "Export Vacation Data")}
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? t("settings.saving", "Saving...") : t("settings.saveChanges", "Save Changes")}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}

// Add this export at the bottom of your settings page file
export const dynamic = 'force-dynamic';
