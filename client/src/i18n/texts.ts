import * as huTexts from "@/i18n/texts-client";
import * as enTexts from "@/i18n/texts-client-en";
import { DEFAULT_LOCALE, type Locale } from "./config";

/**
 * Widens the literal types TypeScript infers from `texts-client.ts` ("Kiemelt túrák") to
 * base type (string). Without this every consumer would be typed against the Hungarian
 * wording, and an English override would not be assignable to it.
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
 * The shape of a dictionary is whatever `texts-client.ts` exports - Hungarian is the source
 * truth, so a key can never exist in a translation without existing in Hungarian first.
 */
export type Texts = { [K in keyof typeof huTexts]: Widen<(typeof huTexts)[K]> };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Overlays a translation on top of Hungarian. Grouped exports (FORM_LABELS, MESSAGES,
 * SIGNUP_VALIDATION) are merged one level deep so a translation can override a few of
 * their entries without having to restate the whole object - a plain spread would drop
 * every key it does not mention.
 */
function withFallback(base: Texts, overrides: Partial<Texts>): Texts {
  const merged: Record<string, unknown> = { ...base };

  for (const [key, override] of Object.entries(overrides)) {
    const current = merged[key];
    merged[key] =
      isPlainObject(current) && isPlainObject(override) ? { ...current, ...override } : override;
  }

  return merged as Texts;
}

const DICTIONARIES: Record<Locale, Texts> = {
  hu: huTexts,
  en: withFallback(huTexts, enTexts as Partial<Texts>),
};

/**
 * Every user-facing string goes through this. Server Components read the locale from
 * their route params; Client Components get it from useTexts() in the locale context.
 */
export function getTexts(locale: Locale = DEFAULT_LOCALE): Texts {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}
