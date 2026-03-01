import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/dashboard", "/clients", "/projects", "/billing", "/settings"];
const authPaths = ["/login", "/register", "/forgot-password"];

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuth = authPaths.some((p) => pathname.startsWith(p));

  // Check for better-auth session cookie
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ??
    request.cookies.get("__Secure-better-auth.session_token");

  const hasCookie = Boolean(sessionCookie);

  // Redirect unauthenticated users away from protected pages
  if (isProtected && !hasCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // NOTE: Do NOT redirect authenticated users away from auth pages at middleware level.
  // Cookie presence doesn't guarantee a valid session — the session may be expired or
  // from a previous DB state. Let the auth pages handle the redirect after verifying
  // the session server-side. This prevents ERR_TOO_MANY_REDIRECTS on stale cookies.

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
