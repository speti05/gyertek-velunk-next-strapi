import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, Route, isLocale, toPublicPath } from "@/i18n/config";
import {
  AUTH_COOKIE,
  SESSION_EXPIRED_PARAM,
  SESSION_EXPIRED_VALUE,
  USER_EMAIL_COOKIE,
} from "@/data/auth-guard";

/**
 * Ends a session whose token Strapi no longer accepts.
 *
 * A Server Component cannot write cookies, so a protected page that finds a dead token
 * redirects here (see sessionExpiredPath); this handler clears both auth cookies and
 * forwards to the login page of the requested locale.
 *
 * It is deliberately harmless to call while signed out - it only ever deletes cookies.
 */
export async function GET(request: NextRequest) {
  const localeParam = request.nextUrl.searchParams.get("locale") ?? undefined;
  const locale = isLocale(localeParam) ? localeParam : DEFAULT_LOCALE;

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = toPublicPath(Route.Login, locale);
  loginUrl.search = "";
  loginUrl.searchParams.set(SESSION_EXPIRED_PARAM, SESSION_EXPIRED_VALUE);

  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete(AUTH_COOKIE);
  response.cookies.delete(USER_EMAIL_COOKIE);
  return response;
}
