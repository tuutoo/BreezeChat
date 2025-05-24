import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, locales } from "./i18n/config";

export function middleware(request: NextRequest) {
  // Get pathname from the URL
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files, API routes, etc.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Extract locale from pathname
  const pathnameLocale = pathname.split("/")[1];

  // Check if the URL doesn't start with a locale
  if (!locales.includes(pathnameLocale)) {
    // First check for locale preference in cookies
    const preferredLocale = request.cookies.get("preferred-locale")?.value;

    // If no cookie, check Accept-Language header
    const acceptLanguage = request.headers.get("accept-language") || "";
    const bestLocale =
      preferredLocale && locales.includes(preferredLocale)
        ? preferredLocale
        : acceptLanguage
        ? locales.find((locale) => acceptLanguage.includes(locale)) ||
          defaultLocale
        : defaultLocale;

    // Redirect to the URL with locale prefix
    const newUrl = new URL(
      `/${bestLocale}${pathname === "/" ? "" : pathname}`,
      request.url
    );

    // Create the response with redirect
    const response = NextResponse.redirect(newUrl);

    // If we derived the locale from Accept-Language, set a cookie for future visits
    if (!preferredLocale && bestLocale) {
      response.cookies.set("preferred-locale", bestLocale, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
      });
    }

    return response;
  }

  // Check if the user is authenticated for admin routes
  if (pathname.includes("/admin")) {
    const isAuthenticated = request.cookies.has("admin-auth");
    if (!isAuthenticated) {
      return NextResponse.redirect(
        new URL(`/${pathnameLocale}/login`, request.url)
      );
    }
  }

  // For all other cases, continue with the response but ensure locale is in the cookie
  const response = NextResponse.next();

  // Set or update the preferred-locale cookie to match the URL
  if (pathnameLocale && locales.includes(pathnameLocale)) {
    const currentCookieLocale = request.cookies.get("preferred-locale")?.value;

    if (currentCookieLocale !== pathnameLocale) {
      response.cookies.set("preferred-locale", pathnameLocale, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
      });
    }
  }

  return response;
}

// Define the matcher for the middleware
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
