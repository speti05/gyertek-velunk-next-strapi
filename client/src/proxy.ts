import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  UNPREFIXED_LOCALE,
  isLocale,
  splitPathname,
  toPhysicalSegments,
  toPublicSegments,
} from "@/i18n/config";

/**
 * Maps the public, locale-aware URL onto the physical App Router tree.
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

export const config = {
  /**
   * Skip Next internals, the API route handlers (they are not localized) and anything
   * that looks like a static file - a rewrite would break their paths.
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
