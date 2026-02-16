import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
