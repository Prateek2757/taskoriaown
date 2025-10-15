import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

const locales = ["en", "ne"];
const defaultLocale = "en";

// Get the preferred locale
function getLocale(request: NextRequest): string {
	// Check if there's a locale in the pathname first
	const { pathname } = request.nextUrl;
	const pathnameLocale = locales.find(
		(locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
	);
	
	if (pathnameLocale) {
		return pathnameLocale;
	}

	// Get language from Accept-Language header
	const acceptLanguage = request.headers.get("accept-language") ?? undefined;
	const headers = { "accept-language": acceptLanguage };
	const languages = new Negotiator({ headers }).languages();

	try {
		return match(languages, locales, defaultLocale);
	} catch {
		return defaultLocale;
	}
}

// Locale middleware function
function localeMiddleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Check if there is any supported locale in the pathname
	const pathnameHasLocale = locales.some(
		(locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
	);

	if (pathnameHasLocale) {
		return NextResponse.next();
	}

	// Redirect if there is no locale
	const locale = getLocale(request);
	const newUrl = new URL(`/${locale}${pathname}`, request.url);
	
	// Preserve query parameters
	newUrl.search = request.nextUrl.search;
	
	return NextResponse.redirect(newUrl);
}

// Combined middleware
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
	function middleware(request: NextRequestWithAuth) {
		// First handle locale
		const localeResponse = localeMiddleware(request);

		// If locale middleware wants to redirect, do it
		if (localeResponse && localeResponse.status === 307) {
			return localeResponse;
		}

		// Continue with auth middleware
		return NextResponse.next();
	},
	{
		callbacks: {
			authorized({ token }) {
				return !!token;
			},
		},
		pages: {
			signIn: "/en/login",
		},
	}
);

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|verify-otp|login|generate-otp|register|forgot-password|change-password|proposaladd|proposalsuccess|otp|favicon.ico).*)",
	],
};