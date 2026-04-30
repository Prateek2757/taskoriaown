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

const SECURITY_HEADERS: Record<string, string> = {
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Robots-Tag": "index, follow",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function applySecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/sitemap_") ||
    pathname === "/robots.txt" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes("/favicon") ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret });

  if (pathname.startsWith("/create")) {
    if (token) {
      return NextResponse.redirect(
        new URL(`/provider/dashboard${search}`, req.url),
        307
      );
    }
  }

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      const signinUrl = new URL("/signin", req.url);
      signinUrl.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(signinUrl, 307);
    }
  }

  if (pathname === "/en-au") {
    return NextResponse.redirect(new URL("/", req.url), 301);
  }

  const rewriteUrl = req.nextUrl.clone();
  rewriteUrl.pathname = `/${defaultLocale}${pathname}`;
  const response = NextResponse.rewrite(rewriteUrl);

  return applySecurityHeaders(response);
}

export { proxy };

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
