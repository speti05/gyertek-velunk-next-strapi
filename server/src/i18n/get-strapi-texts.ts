import * as huTexts from "./texts-strapi";
import * as enTexts from "./texts-strapi-en";

/**
 * Locale resolution for the backend's user-facing strings, mirroring the client's
 * `client/src/i18n/texts.ts`.
 *
 * Templates never import from `texts-strapi.ts` directly - they take the dictionary
 * `getStrapiTexts(locale)` returns, so one resolve per e-mail decides the language of
 * every string in it.
 */

export const LOCALES = ["hu", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "hu";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/** Normalises whatever arrived on the request into a locale we actually have. */
export function toLocale(value: string | undefined | null): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/**
 * Widens the literal types TypeScript infers from `texts-strapi.ts` ("Kiemelt túrák") to
 * their base type (string). Without this every consumer would be typed against the
 * Hungarian wording and an English override would not be assignable to it.
 */
type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends (...args: infer A) => infer R
        ? (...args: A) => R
        : T extends readonly (infer U)[]
          ? Widen<U>[]
          : { [K in keyof T]: Widen<T[K]> };

/**
 * The shape of a dictionary is whatever `texts-strapi.ts` exports - Hungarian is the
 * source of truth, so a key can never exist in a translation without existing in
 * Hungarian first.
 */
export type StrapiTexts = { [K in keyof typeof huTexts]: Widen<(typeof huTexts)[K]> };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Overlays a translation on top of Hungarian. Grouped exports (SYSTEM_EMAIL_SUBJECT) are
 * merged one level deep so a translation can override a few of their entries without
 * restating the whole object - a plain spread would drop every key it does not mention.
 */
function withFallback(base: StrapiTexts, overrides: Partial<StrapiTexts>): StrapiTexts {
  const merged: Record<string, unknown> = { ...base };

  for (const [key, override] of Object.entries(overrides)) {
    const current = merged[key];
    merged[key] =
      isPlainObject(current) && isPlainObject(override) ? { ...current, ...override } : override;
  }

  return merged as StrapiTexts;
}

const DICTIONARIES: Record<Locale, StrapiTexts> = {
  hu: huTexts,
  en: withFallback(huTexts, enTexts as Partial<StrapiTexts>),
};

/**
 * Every user-facing string the backend produces goes through this. The locale comes from
 * the `x-locale` header the Next.js server actions send (see readRequestLocale), or
 * defaults to Hungarian where the reader's language cannot be known.
 */
export function getStrapiTexts(locale: Locale = DEFAULT_LOCALE): StrapiTexts {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

/**
 * The locale of the client that made this request.
 *
 * The Next.js server actions attach `x-locale` when they call Strapi, so a form submitted
 * on the English site produces an English confirmation e-mail. Requests without the
 * header - the Strapi admin, a direct API call, a link clicked in an e-mail - fall back
 * to Hungarian.
 */
export function readRequestLocale(ctx: {
  request: { headers: Record<string, string | string[] | undefined> };
}): Locale {
  const header = ctx?.request?.headers?.["x-locale"];
  return toLocale(Array.isArray(header) ? header[0] : header);
}
