// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET; // ensure this is set

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip assets, public files, _next, and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // Force all non-/en paths to /en
  if (!pathname.startsWith("/en")) {
    const url = req.nextUrl.clone();
    url.pathname = "/en";
    return NextResponse.redirect(url);
  }

  // Protect provider & customer dashboards
  const protectedPaths = [
    "/en/provider/dashboard",
    "/en/customer/dashboard",
    "/en/provider/message",
    "/en/provider/leads",
  ];

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    // Check if user is logged in via JWT
    const token = await getToken({ req, secret });
    if (!token) {
      // Not logged in → redirect to signin
      const url = req.nextUrl.clone();
      url.pathname = "/en/signin";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/en/:path*", "/"], // applies to all /en routes + root
};