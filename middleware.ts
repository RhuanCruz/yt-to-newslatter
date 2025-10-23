import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes and static files
  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Handle root path
    if (pathname === "/") {
      if (!session?.user) {
        return NextResponse.redirect(new URL("/auth", request.url));
      }

      // For now, skip onboarding check (will be implemented via API later)
      // TODO: Check onboarding via API route
      // const response = await fetch(`${request.nextUrl.origin}/api/notifications`)
      // if (!response.ok) redirect to /onboarding

      return NextResponse.redirect(new URL("/home", request.url));
    }

    // Check authentication for protected routes
    const protectedPaths = ["/home", "/channel", "/settings"];
    const isProtectedPath = protectedPaths.some((path) =>
      pathname.startsWith(path)
    );

    if (isProtectedPath) {
      // Redirect to auth if not authenticated
      if (!session?.user) {
        const authUrl = new URL("/auth", request.url);
        authUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(authUrl);
      }

      // Onboarding check skipped for now (frontend-only mode)
      // TODO: Add API check when backend is ready
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // In case of error, redirect to auth for safety
    return NextResponse.redirect(new URL("/auth", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
