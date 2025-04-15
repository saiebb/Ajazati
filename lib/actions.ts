"use server"

import { revalidatePath } from "next/cache"
import { getServerSupabase } from "./supabase"
import type { Vacation, VacationSummary, VacationType } from "@/types"
import { calculateVacationDays } from "./utils"

// Get all vacation types
export async function getVacationTypes(): Promise<VacationType[]> {
  const supabase = getServerSupabase()

  const { data, error } = await supabase.from("vacation_types").select("*").order("id")

  if (error) {
    console.error("Error fetching vacation types:", error)
    throw new Error("Failed to fetch vacation types")
  }

  return data || []
}

// Get vacations for a user
export async function getUserVacations(userId: string): Promise<Vacation[]> {
  const supabase = getServerSupabase()

  const { data, error } = await supabase
    .from("vacations")
    .select(`
      *,
      vacation_type:vacation_types(*)
    `)
    .eq("user_id", userId)
    .order("start_date", { ascending: false })

  if (error) {
    console.error("Error fetching vacations:", error)
    throw new Error("Failed to fetch vacations")
  }

  return data || []
}

// Get upcoming vacations for a user
export async function getUpcomingVacations(userId: string): Promise<Vacation[]> {
  const supabase = getServerSupabase()
  const today = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("vacations")
    .select(`
      *,
      vacation_type:vacation_types(*)
    `)
    .eq("user_id", userId)
    .gte("end_date", today)
    .order("start_date")

  if (error) {
    console.error("Error fetching upcoming vacations:", error)
    throw new Error("Failed to fetch upcoming vacations")
  }

  return data || []
}

// Get vacation summary for a user
export async function getVacationSummary(userId: string): Promise<VacationSummary> {
  const supabase = getServerSupabase()

  // Get user's total vacation days
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("total_vacation_days")
    .eq("id", userId)
    .single()

  if (userError) {
    console.error("Error fetching user data:", userError)
    throw new Error("Failed to fetch user data")
  }

  const totalDays = userData?.total_vacation_days || 21

  // Get all approved vacations for the current year
  const currentYear = new Date().getFullYear()
  const startOfYear = `${currentYear}-01-01`
  const endOfYear = `${currentYear}-12-31`

  const { data: approvedVacations, error: approvedError } = await supabase
    .from("vacations")
    .select("start_date, end_date")
    .eq("user_id", userId)
    .eq("status", "approved")
    .gte("start_date", startOfYear)
    .lte("end_date", endOfYear)

  if (approvedError) {
    console.error("Error fetching approved vacations:", approvedError)
    throw new Error("Failed to fetch approved vacations")
  }

  // Get all pending vacations
  const { data: pendingVacations, error: pendingError } = await supabase
    .from("vacations")
    .select("start_date, end_date")
    .eq("user_id", userId)
    .eq("status", "pending")
    .gte("start_date", startOfYear)
    .lte("end_date", endOfYear)

  if (pendingError) {
    console.error("Error fetching pending vacations:", pendingError)
    throw new Error("Failed to fetch pending vacations")
  }

  // Calculate used days
  let usedDays = 0
  for (const vacation of approvedVacations || []) {
    usedDays += calculateVacationDays(new Date(vacation.start_date), new Date(vacation.end_date))
  }

  // Calculate pending days
  let pendingDays = 0
  for (const vacation of pendingVacations || []) {
    pendingDays += calculateVacationDays(new Date(vacation.start_date), new Date(vacation.end_date))
  }

  return {
    used: usedDays,
    pending: pendingDays,
    remaining: totalDays - usedDays,
    total: totalDays,
  }
}

// Create a new vacation request
export async function createVacation(
  userId: string,
  vacationTypeId: number,
  startDate: Date,
  endDate: Date,
  notes?: string,
): Promise<{ success: boolean; message: string; vacation?: Vacation }> {
  const supabase = getServerSupabase()

  const { data, error } = await supabase
    .from("vacations")
    .insert({
      user_id: userId,
      vacation_type_id: vacationTypeId,
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
      notes,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating vacation:", error)
    return {
      success: false,
      message: "Failed to create vacation request",
    }
  }

  // Create a notification
  await supabase.from("notifications").insert({
    user_id: userId,
    message: `Your vacation request from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()} has been submitted and is pending approval.`,
    vacation_id: data.id,
  })

  revalidatePath("/")

  return {
    success: true,
    message: "Vacation request created successfully",
    vacation: data,
  }
}

// Update vacation status
export async function updateVacationStatus(
  vacationId: string,
  status: "approved" | "rejected",
): Promise<{ success: boolean; message: string }> {
  const supabase = getServerSupabase()

  const { data, error } = await supabase
    .from("vacations")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", vacationId)
    .select("user_id, start_date, end_date")
    .single()

  if (error) {
    console.error("Error updating vacation status:", error)
    return {
      success: false,
      message: "Failed to update vacation status",
    }
  }

  // Create a notification
  await supabase.from("notifications").insert({
    user_id: data.user_id,
    message: `Your vacation request from ${new Date(data.start_date).toLocaleDateString()} to ${new Date(data.end_date).toLocaleDateString()} has been ${status}.`,
    vacation_id: vacationId,
  })

  revalidatePath("/")

  return {
    success: true,
    message: `Vacation ${status} successfully`,
  }
}

// Delete a vacation
export async function deleteVacation(vacationId: string): Promise<{ success: boolean; message: string }> {
  const supabase = getServerSupabase()

  const { error } = await supabase.from("vacations").delete().eq("id", vacationId)

  if (error) {
    console.error("Error deleting vacation:", error)
    return {
      success: false,
      message: "Failed to delete vacation",
    }
  }

  revalidatePath("/")

  return {
    success: true,
    message: "Vacation deleted successfully",
  }
}

// Get user notifications
export async function getUserNotifications(userId: string) {
  const supabase = getServerSupabase()

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching notifications:", error)
    throw new Error("Failed to fetch notifications")
  }

  return data || []
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
  const supabase = getServerSupabase()

  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", notificationId)

  if (error) {
    console.error("Error marking notification as read:", error)
    throw new Error("Failed to mark notification as read")
  }

  revalidatePath("/")

  return { success: true }
}
