"use server"

import { revalidatePath } from "next/cache"
import { getServerSupabase } from "@/lib/supabase"
import { z } from "zod"

const vacationSchema = z.object({
  vacationType: z.string().min(1, "Vacation type is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z
    .date({
      required_error: "End date is required",
    })
    .refine((date) => date instanceof Date, {
      message: "End date is required",
    }),
  notes: z.string().optional(),
})

export async function createVacationAction(formData: FormData) {
  try {
    // For demo purposes, we'll use a hardcoded user ID
    const userId = "123e4567-e89b-12d3-a456-426614174000"

    // Parse and validate the form data
    const rawData = {
      vacationType: formData.get("vacationType") as string,
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      notes: formData.get("notes") as string,
    }

    const validatedData = vacationSchema.parse(rawData)

    // Create the vacation in Supabase
    const supabase = getServerSupabase()

    const { data, error } = await supabase
      .from("vacations")
      .insert({
        user_id: userId,
        vacation_type_id: Number.parseInt(validatedData.vacationType),
        start_date: validatedData.startDate.toISOString().split("T")[0],
        end_date: validatedData.endDate.toISOString().split("T")[0],
        notes: validatedData.notes || null,
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
      message: `Your vacation request from ${validatedData.startDate.toLocaleDateString()} to ${validatedData.endDate.toLocaleDateString()} has been submitted and is pending approval.`,
      vacation_id: data.id,
    })

    revalidatePath("/")

    return {
      success: true,
      message: "Vacation request created successfully",
      vacation: data,
    }
  } catch (error) {
    console.error("Error in createVacationAction:", error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation error",
        errors: error.errors,
      }
    }

    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}
