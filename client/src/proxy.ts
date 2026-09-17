import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  Route,
  UNPREFIXED_LOCALE,
  isLocale,
  splitPathname,
  toPhysicalSegments,
  toPublicPath,
  toPublicSegments,
  type Locale,
} from "@/i18n/config";
import {
  AUTH_COOKIE,
  SESSION_EXPIRED_PARAM,
  SESSION_EXPIRED_VALUE,
  USER_EMAIL_COOKIE,
  isJwtExpired,
  isProtectedRoute,
} from "@/data/auth-guard";

/**
 * Maps the public, locale-aware URL onto the physical App Router tree, and guards the
 * routes that require a signed-in visitor.
 *
 * Next 16 renamed the `middleware` file convention to `proxy`; the API is unchanged.
 *
 * Every route lives under `app/[locale]/` with English folder names, so each request is
 * rewritten to `/<locale>/<physical segments>`:
 *
 *   /turaink      -> /hu/tours      (Hungarian is unprefixed, segment translated back)
 *   /en/tours     -> /en/tours      (already physical)
 *
 * The rewrite is internal: the visitor's address bar keeps the public URL, which is what
 * usePathname() reports, so the language switcher and every link keep working off it.
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const segments = splitPathname(url.pathname);
  const first = segments[0];

  // `/hu/...` would serve the same page as `/...` - redirect so a page is reachable
  // under exactly one URL and search engines see no duplicate content.
  if (first === UNPREFIXED_LOCALE) {
    const redirectUrl = url.clone();
    const rest = segments.slice(1);
    redirectUrl.pathname = rest.length ? `/${rest.join("/")}` : "/";
    return NextResponse.redirect(redirectUrl, 308);
  }

  const locale = isLocale(first) ? first : DEFAULT_LOCALE;
  const publicSegments = isLocale(first) ? segments.slice(1) : segments;

  const physicalSegments = toPhysicalSegments(publicSegments, locale);

  // The guard runs before the rewrite, so a protected page never even starts rendering
  // without a token. It can only see the cookie, not whether Strapi still accepts the
  // token - the page itself catches a token Strapi rejects (see app/[locale]/profile).
  if (isProtectedRoute(physicalSegments)) {
    const token = request.cookies.get(AUTH_COOKIE)?.value;
    if (!token) return redirectToLogin(request, locale, false);
    if (isJwtExpired(token)) return redirectToLogin(request, locale, true);
  }

  const rewriteUrl = url.clone();
  rewriteUrl.pathname = `/${[locale, ...physicalSegments].join("/")}`;

  const publicPath = `/${[
    ...(locale === UNPREFIXED_LOCALE ? [] : [locale]),
    ...toPublicSegments(physicalSegments, locale),
  ].join("/")}`;

  // These have to go on the REQUEST headers, not on the response: headers() in a Server
  // Component reads what the app received, while response headers only reach the browser.
  // They let any server module resolve the locale without threading params through every
  // layer (see data/locale.ts), and let the canonical/hreflang tags rebuild the public URL.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);
  requestHeaders.set("x-public-path", publicPath);

  return NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } });
}

/**
 * Sends the visitor to the login page of their locale.
 *
 * When the request carried an expired token the cookies are cleared on the way out,
 * otherwise the header would keep showing the visitor as signed in and the login page
 * would bounce them straight back to the profile.
 */
function redirectToLogin(request: NextRequest, locale: Locale, wasExpired: boolean) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = toPublicPath(Route.Login, locale);
  loginUrl.search = "";
  if (wasExpired) loginUrl.searchParams.set(SESSION_EXPIRED_PARAM, SESSION_EXPIRED_VALUE);

  const response = NextResponse.redirect(loginUrl);
  if (wasExpired) {
    response.cookies.delete(AUTH_COOKIE);
    response.cookies.delete(USER_EMAIL_COOKIE);
  }
  return response;
}

export const config = {
  /**
   * Skip Next internals, the API route handlers (they are not localized) and anything
   * that looks like a static file - a rewrite would break their paths.
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
