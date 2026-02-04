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
  const { pathname, search } = req.nextUrl; 

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

  if (!hasLocale) {
    const locale = getLocale(req);
    
    if (locale === i18n.defaultLocale) {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}${pathname}`;
      
      const response = NextResponse.rewrite(url);
      
      response.cookies.set("NEXT_LOCALE", locale, {
        maxAge: 31536000, 
        path: "/",
      });
      
      return response;
    } else {
      // ✅ Preserve query params
      const url = new URL(`/${locale}${pathname}${search}`, req.url);
      
      const response = NextResponse.redirect(url, 301);
      response.cookies.set("NEXT_LOCALE", locale, {
        maxAge: 31536000,
        path: "/",
      });
      
      return response;
    }
  }

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
  
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};