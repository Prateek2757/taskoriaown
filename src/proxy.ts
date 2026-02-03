// middleware.ts - OPTIMIZED VERSION
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { i18n } from "../i18n-config";

const secret = process.env.NEXTAUTH_SECRET;

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && i18n.locales.includes(cookieLocale as any)) {
    return cookieLocale;
  }

  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  
  return matchLocale(languages, i18n.locales, i18n.defaultLocale);
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes("/favicon") ||
    pathname.includes("/robots") ||
    pathname.includes("/sitemap") ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const maybeLocale = segments[0];
  const hasLocale = i18n.locales.includes(maybeLocale as any);

  // Handle URLs without locale prefix
  if (!hasLocale) {
    const locale = getLocale(req);
    
    // For default locale, optionally keep URLs clean (no /au prefix)
    // This is SEO-friendly as it avoids duplicate content
    if (locale === i18n.defaultLocale) {
      // Rewrite to localized path without redirect (better for SEO)
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}${pathname}`;
      
      const response = NextResponse.rewrite(url);
      
      // Set locale cookie for future visits
      response.cookies.set("NEXT_LOCALE", locale, {
        maxAge: 31536000, // 1 year
        path: "/",
      });
      
      return response;
    } else {
      // For non-default locales, redirect with 301 (permanent)
      const url = new URL(`/${locale}${pathname}`, req.url);
      
      const response = NextResponse.redirect(url, 301);
      response.cookies.set("NEXT_LOCALE", locale, {
        maxAge: 31536000,
        path: "/",
      });
      
      return response;
    }
  }

  // Extract actual path without locale
  const locale = segments[0];
  const pathnameWithoutLocale = "/" + segments.slice(1).join("/");

  // Handle authentication
  const token = await getToken({ req, secret });

  const protectedPaths = [
    "/provider/dashboard",
    "/messages",
    "/customer/dashboard",
    "/provider/message",
    "/provider/leads",
  ];

  // Redirect authenticated users away from /create
  if (pathnameWithoutLocale.startsWith("/create")) {
    if (token) {
      return NextResponse.redirect(
        new URL(`/${locale}/provider/dashboard`, req.url),
        307 // Temporary redirect
      );
    }
  }

  // Protect routes that require authentication
  if (protectedPaths.some((path) => pathnameWithoutLocale.startsWith(path))) {
    if (!token) {
      const url = new URL(`/${locale}/signin`, req.url);
      url.searchParams.set("callbackUrl", pathname);
      
      return NextResponse.redirect(url, 307);
    }
  }

  // Add security and SEO headers
  const response = NextResponse.next();
  
  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};