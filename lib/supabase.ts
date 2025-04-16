import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { User, Session } from '@/types'

// تكوين Supabase
const supabaseUrl = 'https://hqcjfmzbukchvbagviwt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxY2pmbXpidWtjaHZiYWd2aXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2OTgzODAsImV4cCI6MjA2MDI3NDM4MH0.WEYqNOJdO10mbXrtZxwJdomBiyksIkceHLBn-l6RPcg'
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxY2pmbXpidWtjaHZiYWd2aXd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDY5ODM4MCwiZXhwIjoyMDYwMjc0MzgwfQ.ixSsmtPYhha3zYwa-wRaOwsvHbTSjBh64sRSpXB_eyk'

// إنشاء عميل Supabase للمتصفح
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
})

// إنشاء عميل Supabase للسيرفر
export const getServerSupabase = () => {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    db: {
      schema: 'public'
    }
  })
}

export const getSession = async () => {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie?.value) return null

    const session: Session = JSON.parse(sessionCookie.value)
    return session
  } catch {
    return null
  }
}

export const getUser = async () => {
  const session = await getSession()
  if (!session) return null

  const { data: { user }, error } = await supabase.auth.getUser(session.access_token)
  if (error || !user) return null

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) return null

  return {
    ...user,
    ...profile,
  } as User
}

export const requireAuth = async () => {
  const user = await getUser()
  if (!user) throw new Error("Not authenticated")
  return user
}

export const requireRole = async (roles: string[]) => {
  const user = await requireAuth()
  if (!roles.includes(user.role)) {
    throw new Error("Not authorized")
  }
  return user
}
