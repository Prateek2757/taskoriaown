// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET; // ensure this is set

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req });

  // if (!token) {
  //   // Redict non-authenticated users trying to access private pages
  //   const url = new URL("/signin", req.nextUrl);
  //   url.searchParams.set("callbackUrl", req.nextUrl.pathname); // Preserve intended destination
  //   return NextResponse.redirect(url);
  // }
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
  if (!pathname.startsWith("/")) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Protect provider & customer dashboards
  const protectedPaths = [
    "/provider/dashboard",
    "/customer/dashboard",
    "/provider/message",
    "/provider/leads",
  ];
  
  if (pathname.startsWith("/create")) {
    if (token) {
      const url = req.nextUrl.clone();
      url.pathname = "/provider/dashboard"; // or "/customer/dashboard" depending on role
      return NextResponse.redirect(url);
    }
  }
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    // Check if user is logged in via JWT
    const token = await getToken({ req, secret });
    if (!token) {
      // Not logged in → redirect to signin
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*", "/"], // applies to all /en routes + root
};