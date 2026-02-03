import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { i18n } from "../i18n-config";

const secret = process.env.NEXTAUTH_SECRET;

function getLocale(request: NextRequest): string {
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
    pathname.startsWith("/favicon.ico") ||
    /\.(.*)$/.test(pathname) 
  ) {
    return NextResponse.next();
  }


  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(req);
    
 
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        req.url
      )
    );
  }

 

  const token = await getToken({ req, secret });

  const protectedPaths = [
    "/provider/dashboard",
    "/messages",
    "/customer/dashboard",
    "/provider/message",
    "/provider/leads",
  ];


  const segments = pathname.split("/"); 
  const pathnameWithoutLocale = "/" + segments.slice(2).join("/");


  if (pathnameWithoutLocale.startsWith("/create")) {
    if (token) {
      
      const locale = segments[1]; 
      return NextResponse.redirect(new URL(`/${locale}/provider/dashboard`, req.url));
    }
  }

  if (protectedPaths.some((path) => pathnameWithoutLocale.startsWith(path))) {
    if (!token) {
      const locale = segments[1];
      const url = new URL(`/${locale}/signin`, req.url);
     
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};