"use server"

import { z } from "zod"
import { getServerSupabase, requireAuth } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

const onboardingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  department: z.string().min(1, "Department is required"),
  preferredLanguage: z.enum(["en", "ar"]),
  enableNotifications: z.boolean(),
})

export async function completeOnboarding(formData: FormData) {
  try {
    const user = await requireAuth()
    const supabase = getServerSupabase()

    const validatedData = onboardingSchema.parse({
      name: formData.get("name"),
      department: formData.get("department"),
      preferredLanguage: formData.get("preferredLanguage"),
      enableNotifications: formData.get("enableNotifications") === "true",
    })

    // Update user profile
    const { error: profileError } = await supabase
      .from("users")
      .update({
        name: validatedData.name,
        department: validatedData.department,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (profileError) {
      console.error("Profile error:", profileError)
      return {
        success: false,
        message: profileError.message || "فشل في تحديث الملف الشخصي"
      }
    }

    // Update user preferences
    const { error: preferencesError } = await supabase
      .from("user_preferences")
      .update({
        language: validatedData.preferredLanguage,
        notifications_enabled: validatedData.enableNotifications,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)

    if (preferencesError) throw preferencesError

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error completing onboarding:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to complete onboarding",
    }
  }
}