export type UserRole = "admin" | "user" | "manager"

export type User = {
  profile_image_url: string
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'manager'
  department: string
  total_vacation_days: number
  created_at: string
  updated_at: string
  preferences?: UserPreferences
}

export type UserPreferences = {
  user_id: string
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'ar'
  notifications_enabled: boolean
  calendar_sync_enabled: boolean
  created_at: string
  updated_at: string
}

// Vacation related types
export type VacationType = {
  id: number
  name: string
  color: string
  created_at: string
  updated_at: string
}

export type VacationStatus = "pending" | "approved" | "rejected"

export type Vacation = {
  id: string
  user_id: string
  vacation_type_id: number
  vacation_type?: VacationType
  start_date: string
  end_date: string
  status: 'pending' | 'approved' | 'rejected'
  notes?: string
  created_at: string
  updated_at: string
}

export type VacationSummary = {
  total_days: number
  used_days: number
  pending_days: number
  remaining_days: number
}

export type Notification = {
  id: string
  user_id: string
  message: string
  read: boolean
  vacation_id?: string
  created_at: string
}

export type Session = {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  user: User
}
