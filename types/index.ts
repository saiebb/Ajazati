export interface User {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
  total_vacation_days: number
  profile_image_url: string | null
}

export interface VacationType {
  id: number
  name: string
  description: string | null
  color: string
  icon: string | null
  created_at: string
}

export interface Vacation {
  id: string
  user_id: string
  vacation_type_id: number
  start_date: string
  end_date: string
  notes: string | null
  status: "pending" | "approved" | "rejected"
  created_at: string
  updated_at: string
  vacation_type?: VacationType
}

export interface Notification {
  id: string
  user_id: string
  message: string
  read: boolean
  vacation_id: string | null
  created_at: string
}

export interface UserPreferences {
  user_id: string
  theme: "light" | "dark"
  language: "en" | "ar"
  notifications_enabled: boolean
  calendar_sync_enabled: boolean
  updated_at: string
}

export interface VacationSummary {
  used: number
  remaining: number
  pending: number
  total: number
}
