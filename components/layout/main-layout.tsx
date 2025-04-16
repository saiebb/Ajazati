"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { NavMenu } from "./nav-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { signOut } from "@/app/auth/actions"
import { updateUserPreferences } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { User } from "@/types"

interface MainLayoutProps {
  children: React.ReactNode
  user: User | null
}

export function MainLayout({ children, user }: MainLayoutProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/auth/sign-in")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      })
    }
  }

  const handleLanguageChange = async (language: "en" | "ar") => {
    if (!user) return

    try {
      const result = await updateUserPreferences({
        user_id: user.id,
        language,
        theme: user.preferences?.theme || "system",
        notifications_enabled: user.preferences?.notifications_enabled ?? true,
        calendar_sync_enabled: user.preferences?.calendar_sync_enabled ?? false,
        updated_at: new Date().toISOString(),
        created_at: ""
      })

      if (!result.success) {
        toast({
          title: "Error",
          description: result.message || "Failed to update language preference",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update language preference",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-semibold">
              Vacation Manager
            </Link>
            {user && <NavMenu user={user} />}
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LanguageSelector 
              language={user?.preferences?.language || "en"} 
              onLanguageChange={handleLanguageChange} 
            />
            
            {user ? (
              <>
                <NotificationsDropdown userId={user.id} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profile_image_url || ""} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push("/settings")}>
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => router.push("/auth/sign-in")}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t py-6">
        <div className="container flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Vacation Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
