"use server"

import { z } from "zod"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import { getServerSupabase } from "@/lib/supabase"
import { redirect } from "next/navigation"

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  department: z.string().min(1, "Department is required"),
})

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function signUp(formData: FormData) {
  try {
    const validatedData = signUpSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      department: formData.get("department"),
    })

    const supabase = getServerSupabase()

    // Create the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (authError) {
      console.error("Auth error:", authError)
      return {
        success: false,
        message: authError.message || "حدث خطأ أثناء إنشاء الحساب",
      }
    }

    if (!authData.user?.id) {
      return {
        success: false,
        message: "لم يتم إنشاء المستخدم بشكل صحيح",
      }
    }

    // Create the user profile in the users table
    const { error: profileError } = await supabase.from("users").insert({
      id: authData.user.id,
      email: validatedData.email,
      name: validatedData.name,
      department: validatedData.department,
      role: "user", // Default role
      total_vacation_days: 21, // Default vacation days
    })

    if (profileError) {
      console.error("Profile error:", profileError)
      return {
        success: false,
        message: profileError.message || "حدث خطأ أثناء إنشاء الملف الشخصي",
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in signUp:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred during sign up",
    }
  }
}

export async function signIn(formData: FormData) {
  try {
    const validatedData = signInSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    })

    const supabase = getServerSupabase()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (error) throw error

    // Store the session in a cookie
    const cookieStore = await cookies()
    cookieStore.set("session", JSON.stringify(data.session), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      secure: process.env.NODE_ENV === "production",
    })

    return { success: true }
  } catch (error) {
    console.error("Error in signIn:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Invalid credentials",
    }
  }
}

export async function signOut() {
  const supabase = getServerSupabase()
  await supabase.auth.signOut()
  
  // Clear the session cookie
  const cookieStore = await cookies()
  cookieStore.delete("session")
  
  redirect("/auth/sign-in")
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")?.value
    
    if (!session) return null

    const supabase = getServerSupabase()
    const sessionData = JSON.parse(session)
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(sessionData.access_token)
    if (authError || !user) return null

    // Get user profile with role
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError) return null

    return {
      ...user,
      ...profile,
    }
  } catch {
    return null
  }
}