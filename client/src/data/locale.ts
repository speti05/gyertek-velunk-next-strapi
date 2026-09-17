import { headers } from "next/headers";
import { cache } from "react";
import { DEFAULT_LOCALE, isLocale, toPublicPath, type Locale } from "@/i18n/config";

/**
 * The locale of the current request, as the middleware resolved it from the URL.
 *
 * Read from the `x-locale` request header rather than threaded through every loader
 * signature, mirroring how getPreviewContext() and getViewerContext() pick up their
 * request state. Cached per request.
 *
 * headers() throws outside a request scope (static generation), where the default
 * locale is the right answer.
 */
export const getRequestLocale = cache(async (): Promise<Locale> => {
  try {
    const value = (await headers()).get("x-locale");
    return isLocale(value ?? undefined) ? (value as Locale) : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
});

/**
 * Strapi query params selecting the requested translation.
 *
 * Only content types with i18n enabled (article, blog, event) act on this; Strapi
 * ignores the parameter for the others, so it is safe to send everywhere.
 */
export async function localeQuery(): Promise<{ locale: Locale }> {
  return { locale: await getRequestLocale() };
}

/**
 * The Server Component counterpart of useLocalizedPath(): turns an internal href written
 * in physical (English) form into the public href for the request's locale.
 *
 *   localizedPath("/login")  ->  "/bejelentkezes"  (hu)  |  "/en/login"  (en)
 *
 * Every redirect() and server-rendered href goes through this, otherwise a visitor on the
 * English site would be sent to a Hungarian URL.
 */
export async function localizedPath(href: string): Promise<string> {
  return toPublicPath(href, await getRequestLocale());
}
