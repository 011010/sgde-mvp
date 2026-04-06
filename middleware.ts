import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { MODULE_VISIBILITY } from "@/config/permissions.config";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for auth token in cookies (NextAuth v5 uses different cookie names)
  const authToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  const isLoggedIn = !!authToken;

  const isAuthRoute = pathname.startsWith("/auth");
  const isPublicRoute = pathname === "/" || isAuthRoute;
  const isApiRoute = pathname.startsWith("/api");
  const isStaticRoute =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    (pathname.includes(".") && !pathname.startsWith("/api"));

  // Allow static files and API routes
  if (isStaticRoute || isApiRoute) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Role-based route protection for dashboard
  if (isLoggedIn && pathname.startsWith("/dashboard")) {
    const payload = decodeJwtPayload(authToken);
    const userRoles = (payload?.roles as string[]) || [];

    // Find exact match or longest prefix match
    const matchedRoute = Object.keys(MODULE_VISIBILITY).find(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (matchedRoute) {
      const allowedRoles = MODULE_VISIBILITY[matchedRoute];
      const hasAccess = userRoles.some((role) => allowedRoles.includes(role));
      if (!hasAccess) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
