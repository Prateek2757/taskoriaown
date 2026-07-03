import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;
const defaultLocale = "en";

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

const blockedCrawlerUserAgentTokens = [
  "google",
  "googlebot",
  "googleother",
  "google-inspectiontool",
  "apis-google",
  "bingbot",
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

function isCrawlerRequest(req: NextRequest) {
  const userAgent = req.headers.get("user-agent")?.toLowerCase() ?? "";
  return blockedCrawlerUserAgentTokens.some((token) =>
    userAgent.includes(token)
  );
}

function stripDefaultLocale(pathname: string) {
  const localePrefix = `/${defaultLocale}`;

  if (pathname === localePrefix) {
    return "/";
  }

  if (pathname.startsWith(`${localePrefix}/`)) {
    return pathname.slice(localePrefix.length);
  }

  return pathname;
}

async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (pathname !== "/robots.txt" && isCrawlerRequest(req)) {
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

  const routePath = stripDefaultLocale(pathname);
  const hasDefaultLocale = routePath !== pathname;
  const needsCreateRedirect = routePath.startsWith("/create");
  const needsAuth = protectedPaths.some((path) => routePath.startsWith(path));
  const token =
    needsCreateRedirect || needsAuth ? await getToken({ req, secret }) : null;

  if (needsCreateRedirect) {
    if (token) {
      return NextResponse.redirect(
        new URL(`/provider/dashboard${search}`, req.url),
        307
      );
    }
  }

  if (needsAuth) {
    if (!token) {
      const url = new URL(`/signin`, req.url);
      url.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(url, 307);
    }
  }

  if (hasDefaultLocale) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  const response = NextResponse.rewrite(url);

  // response.headers.set("X-Robots-Tag", "index, follow");
  return response;
}

export { proxy };

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
