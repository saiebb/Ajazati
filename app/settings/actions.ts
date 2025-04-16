"use server"

import { getServerSupabase, requireAuth } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import type { UserPreferences } from "@/types"

export async function updateUserPreferences(preferences: UserPreferences) {
  const user = await requireAuth()
  const supabase = getServerSupabase()

  const { error } = await supabase
    .from("user_preferences")
    .update({
      ...preferences,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)

  if (error) {
    console.error("Error updating preferences:", error)
    throw new Error("Failed to update preferences")
  }

  revalidatePath("/settings")
  return { success: true }
}