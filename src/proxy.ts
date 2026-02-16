import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { i18n } from "../i18n-config";

const secret = process.env.NEXTAUTH_SECRET;

function getLocale(request: NextRequest): string {
  // Defensive check: ensure headers exist
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore: Negotiator expects strict types but works with Record<string, string>
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  
  // Default to 'en' if detection fails
  try {
    return matchLocale(languages, i18n.locales, i18n.defaultLocale);
  } catch (e) {
    return i18n.defaultLocale;
  }
}

// RENAME 'proxy' TO 'middleware'
export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 1. Handle Robots and Sitemap specially to avoid loops
  if (pathname === "/sitemap.xml" || pathname === "/robots.txt") {
    return NextResponse.next();
  }

  // 2. Ignore internal paths and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes("/favicon") ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const maybeLocale = segments[0];
  const hasLocale = i18n.locales.includes(maybeLocale as any);

  // 3. NO LOCALE PRESENT IN URL (e.g. taskoria.com/dashboard)
  if (!hasLocale) {
    const locale = getLocale(req);

    // If default locale, we rewrite (mask) the URL
    if (locale === i18n.defaultLocale) {
      const pathnameWithoutLocale = pathname;
      const token = await getToken({ req, secret }); // Ensure NEXTAUTH_SECRET is set in Vercel

      const protectedPaths = [
        "/provider/dashboard",
        "/messages",
        "/customer/dashboard",
        "/provider/message",
        "/provider/leads",
      ];

      // Handle /create redirect
      if (pathnameWithoutLocale.startsWith("/create")) {
        if (token) {
          const url = new URL(`/provider/dashboard${search}`, req.url);
          return NextResponse.redirect(url, 307);
        }
      }

      // Handle protected routes
      if (protectedPaths.some((path) => pathnameWithoutLocale.startsWith(path))) {
        if (!token) {
          const url = new URL(`/signin`, req.url);
          url.searchParams.set("callbackUrl", pathname + search);
          return NextResponse.redirect(url, 307);
        }
      }

      // Rewrite to the internal locale folder
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}${pathname}`;
      const response = NextResponse.rewrite(url);

      // Security & SEO Headers
      response.headers.set("Content-Language", locale);
      response.headers.set("X-Robots-Tag", "index, follow");
      return response;
    }

    // If not default locale, Redirect to the locale prefix (e.g. /fr/dashboard)
    const url = new URL(`/${locale}${pathname}${search}`, req.url);
    return NextResponse.redirect(url, 301);
  }

  // 4. LOCALE IS PRESENT (e.g. taskoria.com/en/dashboard)
  const locale = segments[0];
  const pathnameWithoutLocale = "/" + segments.slice(1).join("/");
  const token = await getToken({ req, secret });

  const protectedPaths = [
    "/provider/dashboard",
    "/messages",
    "/customer/dashboard",
    "/provider/message",
    "/provider/leads",
  ];

  if (pathnameWithoutLocale.startsWith("/create")) {
    if (token) {
      const url = new URL(`/${locale}/provider/dashboard${search}`, req.url);
      return NextResponse.redirect(url, 307);
    }
  }

  if (protectedPaths.some((path) => pathnameWithoutLocale.startsWith(path))) {
    if (!token) {
      const url = new URL(`/${locale}/signin`, req.url);
      url.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(url, 307);
    }
  }

  const response = NextResponse.next();
  response.headers.set("Content-Language", locale);
  response.headers.set("X-Robots-Tag", "index, follow");
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};