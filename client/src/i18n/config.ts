/**
 * Single source of truth for the site's locales and for the URL shape of each one.
 *
 * Hungarian is the default locale and stays unprefixed (`/turaink`), English lives
 * under `/en` (`/en/tours`). The App Router folders under `app/[locale]/` are named in
 * English - that is the physical form every href in the app is written in, and this file
 * owns the translation in both directions:
 *
 *   public URL            physical route              built by
 *   /turaink              app/[locale]/tours          toPhysicalSegments()  (proxy)
 *   /en/tours             app/[locale]/tours          toPublicPath()        (links)
 *
 * So an href is always written as `/tours`, never `/turaink`, wherever it lives - in the
 * code or in a Strapi link component. Content slugs are the exception: nothing here
 * translates them, so each locale stores its own (see TERMS_LINK in i18n/texts-client.ts).
 */

export const LOCALES = ["hu", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "hu";

/** The locale whose URLs carry no prefix. Kept separate from DEFAULT_LOCALE on purpose:
 *  the default locale is what we fall back to, the unprefixed one is a URL decision. */
export const UNPREFIXED_LOCALE: Locale = "hu";

/**
 * Route names per locale.
 *
 * The `en` value doubles as the **physical segment** - the folder name under
 * `app/[locale]/` - because the folders are named in English. The object key is just a
 * readable label; nothing reads it, so it is the `en` value that has to match the folder.
 */
const ROUTE_SEGMENTS = {
  tours: { hu: "turaink", en: "tours" },
  reports: { hu: "beszamolok", en: "reports" },
  blog: { hu: "blog", en: "blog" },
  login: { hu: "bejelentkezes", en: "login" },
  register: { hu: "regisztracio", en: "register" },
  profile: { hu: "profil", en: "profile" },
  "forgot-password": { hu: "elfelejtett-jelszo", en: "forgot-password" },
} as const satisfies Record<string, Record<Locale, string>>;

/**
 * Every route the app links to, in physical form - what `toPublicPath()` expects.
 *
 * This is the full inventory, so an href is never written as a bare string: pass a member
 * to `useLocalizedPath()` / `localizedPath()` and the locale-correct URL comes back.
 * A route with a content slug composes: `` `${Route.Tours}/${slug}` ``.
 *
 * The values are interpolated from the `en` column above so a route name is written once.
 * This is a const object rather than an enum because a TypeScript string enum only accepts
 * literal initializers - an interpolated member is a compile error (TS18033). Usage is the
 * same, and `Route` is exported as the union type of its values as well.
 *
 * Content pages (terms, privacy, the travel contract) are NOT here - their slug differs
 * per locale and lives in the texts files. See TERMS_LINK in i18n/texts-client.ts.
 */
export const Route = {
  Home: "/",
  Tours: `/${ROUTE_SEGMENTS.tours.en}`,
  Reports: `/${ROUTE_SEGMENTS.reports.en}`,
  Blog: `/${ROUTE_SEGMENTS.blog.en}`,
  Login: `/${ROUTE_SEGMENTS.login.en}`,
  Register: `/${ROUTE_SEGMENTS.register.en}`,
  Profile: `/${ROUTE_SEGMENTS.profile.en}`,
  ForgotPassword: `/${ROUTE_SEGMENTS["forgot-password"].en}`,
  /** Not in ROUTE_SEGMENTS, so never translated: the URL is stored in the Strapi
   *  users-permissions settings and is baked into every confirmation e-mail sent. */
  ConfirmEmail: "/confirm-email",
  /** Not in ROUTE_SEGMENTS - see ConfirmEmail. */
  ResetPassword: "/reset-password",
} as const;

export type Route = (typeof Route)[keyof typeof Route];

/**
 * The BCP-47 tag each locale formats dates and numbers with. Kept apart from the locale
 * code itself: `hu`/`en` name the site's language, these name a regional convention.
 * English uses en-GB so a date reads "6 May 2026" like the Hungarian day-after-month
 * order, rather than the American "May 6, 2026".
 */
export const INTL_LOCALE: Record<Locale, string> = {
  hu: "hu-HU",
  en: "en-GB",
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/** physical segment -> public segment, and its reverse, per locale. Both built once. */
const { PUBLIC_BY_PHYSICAL, PHYSICAL_BY_PUBLIC } = (() => {
  const toPublic = {} as Record<Locale, Record<string, string>>;
  const toPhysical = {} as Record<Locale, Record<string, string>>;

  for (const locale of LOCALES) {
    toPublic[locale] = {};
    toPhysical[locale] = {};
  }

  // Keyed off the `en` value, not the object key - `en` is the physical segment.
  for (const byLocale of Object.values(ROUTE_SEGMENTS)) {
    for (const locale of LOCALES) {
      toPublic[locale][byLocale.en] = byLocale[locale];
      toPhysical[locale][byLocale[locale]] = byLocale.en;
    }
  }

  return { PUBLIC_BY_PHYSICAL: toPublic, PHYSICAL_BY_PUBLIC: toPhysical };
})();

/** Only the first segment names a section; everything after it is a content slug,
 *  which Strapi already stores per locale. */
function mapFirstSegment(segments: string[], translate: (segment: string) => string) {
  if (segments.length === 0) return segments;
  return [translate(segments[0]), ...segments.slice(1)];
}

/** Public URL segments -> physical folder names. Used by the middleware rewrite. */
export function toPhysicalSegments(segments: string[], locale: Locale): string[] {
  return mapFirstSegment(segments, (segment) => PHYSICAL_BY_PUBLIC[locale][segment] ?? segment);
}

/** Physical folder names -> public URL segments for the given locale. */
export function toPublicSegments(segments: string[], locale: Locale): string[] {
  return mapFirstSegment(segments, (segment) => PUBLIC_BY_PHYSICAL[locale][segment] ?? segment);
}

export function splitPathname(pathname: string): string[] {
  return pathname.split("/").filter(Boolean);
}

/** Reads the locale off a public URL. Unprefixed paths are the unprefixed locale. */
export function localeFromPathname(pathname: string): Locale {
  const first = splitPathname(pathname)[0];
  return isLocale(first) ? first : UNPREFIXED_LOCALE;
}

/** Drops the locale prefix, returning the remaining public segments. */
export function stripLocale(pathname: string): string[] {
  const segments = splitPathname(pathname);
  return isLocale(segments[0]) ? segments.slice(1) : segments;
}

function joinPath(locale: Locale, segments: string[]): string {
  const prefix = locale === UNPREFIXED_LOCALE ? [] : [locale];
  const path = [...prefix, ...segments].join("/");
  return path ? `/${path}` : "/";
}

/**
 * Builds the public href for an internal path written in physical (Hungarian) form.
 * This is what every link in the app should go through:
 *
 *   toPublicPath("/turaink/tatra", "en")  ->  "/en/tours/tatra"
 *   toPublicPath("/turaink/tatra", "hu")  ->  "/turaink/tatra"
 *
 * External URLs, anchors and query-only hrefs are returned untouched.
 */
export function toPublicPath(href: string, locale: Locale): string {
  if (!href || !href.startsWith("/")) return href;

  const [pathPart, ...rest] = href.split(/(?=[?#])/);
  const suffix = rest.join("");
  return joinPath(locale, toPublicSegments(splitPathname(pathPart), locale)) + suffix;
}

/**
 * Rewrites the URL the visitor is currently on into another locale, translating the
 * section segment on the way.
 *
 * Content slugs are carried over unchanged, which is only correct for routes that have
 * no slug (`/turaink`, `/login`, `/`). An entry's slug is stored per locale in Strapi
 * and cannot be derived here, so a page showing one entry must pass the translated href
 * to <LanguageSwitcher alternates={...}> - see getLocalizedSlugs() in data/loaders.
 */
export function switchLocalePath(pathname: string, target: Locale): string {
  const current = localeFromPathname(pathname);
  if (current === target) return pathname;

  const publicSegments = stripLocale(pathname);
  const physical = toPhysicalSegments(publicSegments, current);
  return joinPath(target, toPublicSegments(physical, target));
}
