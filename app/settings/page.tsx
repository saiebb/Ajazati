"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ThemeSelector } from "@/components/theme-selector"
import { LanguageSelector } from "@/components/language-selector"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { updateUserPreferences } from "@/lib/actions"
import type { UserPreferences } from "@/types"
import { supabase, requireAuth } from "@/lib/supabase"

type Theme = "light" | "dark" | "system"
type Language = "en" | "ar"

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadPreferences()
  }, [])

  async function loadPreferences() {
    try {
      const user = await requireAuth()
      const { data: prefs } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single()

      setPreferences(prefs)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load preferences",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handlePreferenceChange<T extends keyof UserPreferences>(
    key: T,
    value: UserPreferences[T]
  ) {
    if (!preferences) return

    try {
      const updatedPreferences = {
        ...preferences,
        [key]: value,
      }

      await updateUserPreferences(updatedPreferences)
      setPreferences(updatedPreferences)

      toast({
        title: "Success",
        description: "Preferences updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how the application looks and feels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Theme</Label>
            <ThemeSelector
              theme={preferences?.theme as Theme || "system"}
              onThemeChange={(theme: Theme) => handlePreferenceChange("theme", theme)}
            />
          </div>
          <div className="space-y-2">
            <Label>Language</Label>
            <LanguageSelector
              language={preferences?.language as Language || "en"}
              onLanguageChange={(lang: Language) => handlePreferenceChange("language", lang)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Configure your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about vacation requests and updates
              </p>
            </div>
            <Switch
              checked={preferences?.notifications_enabled}
              onCheckedChange={(checked) =>
                handlePreferenceChange("notifications_enabled", checked)
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Calendar Sync</Label>
              <p className="text-sm text-muted-foreground">
                Sync vacation dates with your calendar
              </p>
            </div>
            <Switch
              checked={preferences?.calendar_sync_enabled}
              onCheckedChange={(checked) =>
                handlePreferenceChange("calendar_sync_enabled", checked)
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
