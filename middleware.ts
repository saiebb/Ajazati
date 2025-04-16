import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Add paths that don't require authentication
const publicPaths = ["/auth/sign-in", "/auth/sign-up", "/onboarding"]

// Add paths that should be accessible for static assets and API routes
const bypassPaths = ["/api/", "/_next", "/favicon.ico", "/images/", "/fonts/"]

// Add paths that require admin role
const adminPaths = ["/settings/users", "/settings/roles", "/settings/vacation-types"]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Allow public paths without authentication
  if (publicPaths.includes(path)) {
    return NextResponse.next()
  }
  
  // Bypass middleware for static assets and API routes
  if (bypassPaths.some(bp => path.startsWith(bp))) {
    return NextResponse.next()
  }

  try {
    // Get session from cookie
    const sessionCookie = request.cookies.get("session")
    if (!sessionCookie?.value) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url))
    }

    const session = JSON.parse(sessionCookie.value)

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Verify the session
    const { data: { user }, error: authError } = await supabase.auth.getUser(session.access_token)
    if (authError || !user) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url))
    }

    // Get user profile with role
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role, onboarding_completed")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url))
    }

    // Check if path requires admin role
    if (adminPaths.some(p => path.startsWith(p)) && profile.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Check if onboarding is required
    if (path === "/" && !profile.onboarding_completed) {
      return NextResponse.redirect(new URL("/onboarding", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // If there's any error, redirect to sign in
    return NextResponse.redirect(new URL("/auth/sign-in", request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
