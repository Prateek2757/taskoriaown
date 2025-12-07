import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET; 

export async function proxy(req: NextRequest) {
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

  if (!pathname.startsWith("/")) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  const protectedPaths = [
    "/provider/dashboard",
    "/messages/*",
    "/customer/dashboard",
    "/provider/message",
    "/provider/leads",
  ];
  
  if (pathname.startsWith("/create")) {
    if (token) {
      const url = req.nextUrl.clone();
      url.pathname = "/provider/dashboard"; 
      return NextResponse.redirect(url);
    }
  }
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const token = await getToken({ req, secret });
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*", "/"], 
};