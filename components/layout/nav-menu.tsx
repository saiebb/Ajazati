"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { User } from "@/types"
import { cn } from "@/lib/utils"

interface NavMenuProps {
  user: User | null
}

export function NavMenu({ user }: NavMenuProps) {
  const pathname = usePathname()

  const navigationItems = [
    {
      href: "/",
      label: "Dashboard",
      roles: ["admin", "user", "manager"],
    },
    {
      href: "/calendar",
      label: "Calendar",
      roles: ["admin", "user", "manager"],
    },
    {
      href: "/insights",
      label: "Insights",
      roles: ["admin", "manager"],
    },
    {
      href: "/settings/users",
      label: "User Management",
      roles: ["admin"],
    },
    {
      href: "/settings",
      label: "Settings",
      roles: ["admin", "user", "manager"],
    },
  ]

  const filteredItems = navigationItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  )

  return (
    <nav className="flex items-center space-x-6">
      {filteredItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}