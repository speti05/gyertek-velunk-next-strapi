/**
 * Route-level authentication guard, shared by the proxy (middleware) and the pages.
 *
 * Imported by proxy.ts, so everything here has to run on the edge runtime: no Node APIs,
 * no next/headers, pure functions only.
 */

import { Route, type Locale } from "@/i18n/config";

/** Names of the two cookies set at login. Single source of truth - see data/auth-actions. */
export const AUTH_COOKIE = "jwt";
export const USER_EMAIL_COOKIE = "user_email";

/** Marker the login page reads to explain why the visitor was sent back. */
export const SESSION_EXPIRED_PARAM = "session";
export const SESSION_EXPIRED_VALUE = "expired";

/**
 * Route handler that clears the auth cookies and forwards to the login page.
 *
 * Needed because only a Route Handler or a Server Action may write cookies - a Server
 * Component that discovers a dead token cannot clear it itself, so it redirects here.
 * The locale travels as a query parameter: this path is excluded from the proxy, so the
 * handler never sees the `x-locale` header.
 */
export const SESSION_EXPIRED_ROUTE = "/api/auth/session-expired";

export function sessionExpiredPath(locale: Locale): string {
  return `${SESSION_EXPIRED_ROUTE}?locale=${locale}`;
}

/**
 * Routes that require a signed-in visitor, in physical (English) form.
 *
 * Adding a route here is the only step needed to protect it: the proxy translates the
 * public URL (`/profil`, `/en/profile`) before matching, so every locale is covered.
 */
export const PROTECTED_ROUTES: readonly string[] = [Route.Profile];

/**
 * Whether the request targets a protected route.
 *
 * Takes the physical segments the proxy has already resolved, so the check is locale
 * agnostic: `/profil`, `/en/profile` and `/hu/profile` all arrive here as `["profile"]`.
 */
export function isProtectedRoute(physicalSegments: string[]): boolean {
  if (physicalSegments.length === 0) return false;
  return PROTECTED_ROUTES.includes(`/${physicalSegments[0]}`);
}

/**
 * Whether a JWT's `exp` claim is in the past.
 *
 * The payload is read WITHOUT verifying the signature - the secret lives in Strapi and
 * the edge runtime has no way to check it. That is fine for what this decides: a forged
 * token gets rejected by Strapi on the next API call anyway, so the only thing at stake
 * is whether we bother sending the visitor to a page that cannot load their data.
 *
 * A token that cannot be parsed counts as expired: it is not something Strapi issued.
 */
export function isJwtExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload) return true;
  // A token without an expiry never expires (Strapi allows configuring that).
  if (typeof payload.exp !== "number") return false;
  return payload.exp * 1000 <= Date.now();
}

function decodeJwtPayload(token: string): { exp?: number } | null {
  const segment = token.split(".")[1];
  if (!segment) return null;

  try {
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}
