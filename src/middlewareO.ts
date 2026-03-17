import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

const locales = ["en", "ne"];
const defaultLocale = "en";

function getLocale(request: NextRequest): string {
	const { pathname } = request.nextUrl;
	const pathnameLocale = locales.find(
		(locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
	);
	
	if (pathnameLocale) {
		return pathnameLocale;
	}

	const acceptLanguage = request.headers.get("accept-language") ?? undefined;
	const headers = { "accept-language": acceptLanguage };
	const languages = new Negotiator({ headers }).languages();

	try {
		return match(languages, locales, defaultLocale);
	} catch {
		return defaultLocale;
	}
}

function localeMiddleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const pathnameHasLocale = locales.some(
		(locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
	);

	if (pathnameHasLocale) {
		return NextResponse.next();
	}

	const locale = getLocale(request);
	const newUrl = new URL(`/${locale}${pathname}`, request.url);
	
	newUrl.search = request.nextUrl.search;
	
	return NextResponse.redirect(newUrl);
}

import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
	function middleware(request: NextRequestWithAuth) {
		const localeResponse = localeMiddleware(request);

		if (localeResponse && localeResponse.status === 307) {
			return localeResponse;
		}

		return NextResponse.next();
	},
	{
		callbacks: {
			authorized({ token }) {
				return !!token;
			},
		},
		pages: {
			signIn: "/signin",
		},
	}
);

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|verify-otp|login|generate-otp|register|forgot-password|change-password|proposaladd|proposalsuccess|otp|favicon.ico).*)",
	],
};