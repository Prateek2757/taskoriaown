import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;
const defaultLocale = "en";
const publicLocalePrefixes = new Set(["en", "en-au", "au", "ne"]);

const protectedPaths = [
  "/provider/dashboard",
  "/messages",
  "/customer/dashboard",
  "/provider/message",
  "/provider/leads",
  "/settings",
  "/admin",
  "/admin/adminbudgetmanager",
  "/provider-responses",
];

const allowedGoogleCrawlerUserAgentTokens = [
  "googlebot",
  "google-inspectiontool",
  "apis-google",
  "adsbot-google",
  "mediapartners-google",
  "googleother",
  "feedfetcher-google",
  "storebot-google",
];

const blockedCrawlerUserAgentTokens = [
  "gptbot",
  "claudebot",
  "petalbot",
  "amazonbot",
  "duckassistbot",
  "ahrefsbot",
  "semrush",
  "bot",
  "crawler",
  "spider",
  "scraper",
];

function isAllowedGoogleCrawlerRequest(req: NextRequest) {
  const userAgent = req.headers.get("user-agent")?.toLowerCase() ?? "";
  return allowedGoogleCrawlerUserAgentTokens.some((token) =>
    userAgent.includes(token)
  );
}

function isCrawlerRequest(req: NextRequest) {
  const userAgent = req.headers.get("user-agent")?.toLowerCase() ?? "";
  return blockedCrawlerUserAgentTokens.some((token) =>
    userAgent.includes(token)
  );
}

function stripPublicLocale(pathname: string) {
  const [, firstSegment = "", ...restSegments] = pathname.split("/");

  if (!publicLocalePrefixes.has(firstSegment.toLowerCase())) {
    return pathname;
  }

  const strippedPath = `/${restSegments.join("/")}`;

  return strippedPath === "/" ? "/" : strippedPath.replace(/\/$/, "");
}

function stripDefaultLocale(pathname: string) {
  return stripPublicLocale(pathname);
}

function isSigninPath(pathname: string) {
  return pathname === "/signin" || pathname === `/${defaultLocale}/signin`;
}

function withDefaultLocale(pathname: string) {
  if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
    return pathname;
  }

  return `/${defaultLocale}${pathname}`;
}

function withoutDefaultLocale(pathname: string) {
  return stripDefaultLocale(pathname);
}

function getSafeRedirectPath(value: string | null, req: NextRequest) {
  if (!value) return null;

  try {
    const url = new URL(value, req.url);

    if (url.origin !== req.nextUrl.origin) return null;
    if (isSigninPath(url.pathname)) return null;

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (
    pathname !== "/robots.txt" &&
    !isAllowedGoogleCrawlerRequest(req) &&
    isCrawlerRequest(req)
  ) {
    return new NextResponse("Crawling disabled", {
      status: 403,
      headers: {
        "X-Robots-Tag": "noindex, nofollow, noarchive",
        "Cache-Control": "no-store",
      },
    });
  }

  if (
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes("/favicon") ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const routePath = stripPublicLocale(pathname);
  const hasPublicLocalePrefix = routePath !== pathname;

  if (hasPublicLocalePrefix) {
    return NextResponse.redirect(new URL(`${routePath}${search}`, req.url), 308);
  }

  const needsCreateRedirect = routePath.startsWith("/create");
  const needsAuth = protectedPaths.some((path) => routePath.startsWith(path));
  const needsSigninRedirect = routePath === "/signin";
  const token =
    needsCreateRedirect || needsAuth || needsSigninRedirect
      ? await getToken({ req, secret })
      : null;

  if (needsCreateRedirect) {
    if (token) {
      return NextResponse.redirect(
        new URL(`/provider/dashboard${search}`, req.url),
        307
      );
    }
  }

  if (needsSigninRedirect && token) {
    const redirectPath =
      getSafeRedirectPath(req.nextUrl.searchParams.get("callbackUrl"), req) ??
      "/provider/dashboard";

    return NextResponse.redirect(
      new URL(withoutDefaultLocale(redirectPath), req.url),
      307
    );
  }

  if (needsAuth) {
    if (!token) {
      const url = new URL("/signin", req.url);
      url.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(url, 307);
    }
  }

  const url = req.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  const response = NextResponse.rewrite(url);

  // response.headers.set("X-Robots-Tag", "index, follow");
  return response;
}
//sd
export { proxy };

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
