"use server"

import { getServerSupabase } from "@/lib/supabase"
import { User } from "@/types"
import { revalidatePath } from "next/cache"

export async function getAllUsers(): Promise<User[]> {
  const supabase = getServerSupabase()

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
    throw new Error("Failed to fetch users")
  }

  return data || []
}

export async function updateUserRole(userId: string, newRole: "admin" | "user" | "manager") {
  const supabase = getServerSupabase()

  // First, verify that the current user is an admin
  const currentUser = await getCurrentUser()
  if (!currentUser || currentUser.role !== "admin") {
    throw new Error("Unauthorized: Only admins can update user roles")
  }

  const { error } = await supabase
    .from("users")
    .update({ role: newRole, updated_at: new Date().toISOString() })
    .eq("id", userId)

  if (error) {
    console.error("Error updating user role:", error)
    throw new Error("Failed to update user role")
  }

  revalidatePath("/settings/users")
}

async function getCurrentUser() {
  const supabase = getServerSupabase()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) return null

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  return profile
}