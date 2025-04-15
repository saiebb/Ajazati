import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if onboarding has been completed
  const onboardingCompleted = request.cookies.get("onboardingCompleted")?.value === "true"

  // Check if onboarding has been shown (to prevent infinite redirects)
  const onboardingShown = request.cookies.get("onboardingShown")?.value === "true"

  // If this is the root path and onboarding hasn't been completed yet
  if (request.nextUrl.pathname === "/" && !onboardingCompleted && !onboardingShown) {
    // Redirect to onboarding
    return NextResponse.redirect(new URL("/onboarding", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/onboarding"],
}
