import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;
const defaultLocale = "en";
const publicLocalePrefixes = new Set(["en", "en-au", "au", "ne"]);

type RateLimitEntry = { count: number; resetAt: number };

// This protects downstream handlers from short bursts. On Vercel, each isolate has
// its own memory, so keep the Vercel Firewall enabled for globally coordinated
// rate limiting as well.
const rateLimitStore = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const SENSITIVE_API_PREFIXES = [
  "/api/auth/forget-password",
  "/api/auth/register-session",
  "/api/chat",
  "/api/contact",
  "/api/emailVerification",
  "/api/googlemap",
  "/api/provider-compose-email",
  "/api/signup",
];
const FILTER_EXEMPT_PATHS = [
  "/api/cron/",
  "/api/stripe/webhook",
  "/api/stripe/prowebhook",
];

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
  "feedfetcher-google",
  "storebot-google",
];

const blockedCrawlerUserAgentTokens = [
  "gptbot",
  "chatgpt-user",
  "oai-searchbot",
  "googleother",
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

function isFilterExemptPath(pathname: string) {
  return FILTER_EXEMPT_PATHS.some((path) => pathname.startsWith(path));
}

function getClientIp(req: NextRequest) {
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

function getApiRequestLimit(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (SENSITIVE_API_PREFIXES.some((path) => pathname.startsWith(path))) {
    return 10;
  }

  // Mutations are more costly and risky than ordinary reads.
  return ["POST", "PUT", "PATCH", "DELETE"].includes(req.method) ? 30 : 120;
}

function rateLimitApiRequest(req: NextRequest) {
  const now = Date.now();
  const limit = getApiRequestLimit(req);
  const key = `${getClientIp(req)}:${req.method}:${req.nextUrl.pathname}`;
  const current = rateLimitStore.get(key);

  // Bound memory use if an attacker continuously rotates source addresses.
  if (rateLimitStore.size > 10_000) {
    for (const [storedKey, entry] of rateLimitStore) {
      if (entry.resetAt <= now) rateLimitStore.delete(storedKey);
    }
  }

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return null;
  }

  current.count += 1;
  if (current.count <= limit) return null;

  const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
  return NextResponse.json(
    { error: "Too many requests. Please try again shortly." },
    {
      status: 429,
      headers: {
        "Cache-Control": "no-store",
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": "0",
      },
    }
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
  const { pathname: requestedPathname, search } = req.nextUrl;
  // Google previously discovered service/location URLs with their path
  // separators encoded (for example, `service%2Fqld%2Fbrisbane`). Decode only
  // those separators before route matching so they make one canonical redirect
  // instead of repeatedly redirecting to the same encoded URL.
  const pathname = requestedPathname.replace(/%2f/gi, "/");

  const isExempt = isFilterExemptPath(pathname);

  if (
    !isExempt &&
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

  if (pathname.startsWith("/api/") && !isExempt) {
    const rateLimitedResponse = rateLimitApiRequest(req);
    if (rateLimitedResponse) return rateLimitedResponse;
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

  if (hasPublicLocalePrefix || pathname !== requestedPathname) {
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
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
