# Localization

How this project serves Hungarian and English, and which resource is handled where.

Hungarian (`hu`) is the default locale and its URLs carry **no prefix**. English (`en`)
lives under `/en`. Adding a third locale means adding it to `LOCALES` and filling in the
tables below — no new machinery.

---

## 1. The one rule

Every internal href, **wherever it is written**, is in **physical form**: the English
folder name under `client/src/app/[locale]/`. The locale-correct URL is produced at render
time.

```
write        /tours
hu renders   /turaink
en renders   /en/tours
```

This holds in application code *and* in Strapi link components. An editor filling in the
navigation types `/tours`, not `/turaink`.

**The exception — content slugs.** Nothing translates them. A Strapi page slug differs per
locale, and each locale's value is stored separately (see §5). Writing `/aszf` gives you
`/aszf` in Hungarian and `/en/aszf` in English — which 404s, because the English page is
saved under `terms`. That is why those links go through the texts files, not the route
table.

---

## 2. Route segments — `client/src/i18n/config.ts`

`ROUTE_SEGMENTS` is the single source of the route names — every locale's spelling in one
table. The `en` column doubles as the **physical segment**, the folder name under
`app/[locale]/`, because the folders are named in English.

| `Route` | `en` = folder | `hu` |
| --- | --- | --- |
| `Tours` | `tours` | `turaink` |
| `Reports` | `reports` | `beszamolok` |
| `Blog` | `blog` | `blog` |
| `Login` | `login` | `bejelentkezes` |
| `Register` | `register` | `regisztracio` |
| `Profile` | `profile` | `profil` |
| `ForgotPassword` | `forgot-password` | `elfelejtett-jelszo` |
| `ConfirmEmail` | `confirm-email` | *(not in the table)* |
| `ResetPassword` | `reset-password` | *(not in the table)* |
| — | `[slug]` | *(content)* |

The `Route` values are interpolated from that `en` column — `` Tours: `/${ROUTE_SEGMENTS.tours.en}` `` —
so a route name is written once. `Route` is a **const object, not an enum**: a TypeScript
string enum only accepts literal initializers, and an interpolated member is a compile
error (TS18033). Usage is unchanged (`Route.Tours`), and `Route` is exported as the union
type of its values too, so it still works as a prop type.

The two lookup indexes are built from `ROUTE_SEGMENTS` once at module load, keyed off the
`en` value rather than the object key — the key is only a readable label.

`Route.ConfirmEmail` and `Route.ResetPassword` are **deliberately untranslated**. Their URLs are
stored in the Strapi users-permissions settings (`server/src/index.ts`) and are baked into
every confirmation e-mail already sent, so they must stay identical in every locale.
Renaming them breaks links that are already in people's inboxes.

### Who does the translating

| Direction | Function | Used by |
| --- | --- | --- |
| public URL → physical route | `toPhysicalSegments()` | `client/src/proxy.ts` (the rewrite) |
| physical href → public URL | `toPublicPath()` | every link |
| current URL → other locale | `switchLocalePath()` | `LanguageSwitcher` |

Only the **first** segment is translated; everything after it is a content slug, which
Strapi already stores per locale.

### Calling it

| Context | Helper |
| --- | --- |
| Client Component | `useLocalizedPath()` — `client/src/context/locale-context.tsx` |
| Server Component / action | `localizedPath()` — `client/src/data/locale.ts` |
| Inside a `.map()` in a Server Component | `toPublicPath(href, locale)` with the locale resolved once above |

The last one exists because `.map()` callbacks are not async. `Card`, `Footer` and the
profile page all resolve the locale once at the top and call `toPublicPath` synchronously.

### Using `Route`

An href is never written as a bare string. `Route` is the full inventory of routes in
physical form, and every call passes a member:

```ts
redirect(await localizedPath(Route.Profile));   // -> /profil   | /en/profile
href={localizePath(Route.Login)}                // -> /bejelentkezes | /en/login
```

A route that carries a content slug composes from it:

```ts
toPublicPath(`${Route.Tours}/${slug}`, locale)
```

Card components pick their own base path from it (`EventCard` → `Route.Tours`,
`BlogCard` → `Route.Reports`, `BlogPostCard` → `Route.Blog`) and accept
`Omit<CardProps, "basePath">`, so a caller cannot pass a wrong one.

Content pages are **not** in `Route` — their slug differs per locale and lives in the
texts files (§5).

---

## 3. UI strings

Both sides have the same three-file shape: Hungarian is the source of truth, English is a
set of overrides, and a resolver merges them.

| File | Holds |
| --- | --- |
| `client/src/i18n/texts-client.ts` | Next.js — Hungarian, **the source of truth** |
| `client/src/i18n/texts-client-en.ts` | Next.js — English overrides |
| `client/src/i18n/texts.ts` | merges them; `getTexts(locale)` |
| `server/src/i18n/texts-strapi.ts` | Strapi — Hungarian, **the source of truth** |
| `server/src/i18n/texts-strapi-en.ts` | Strapi — English overrides |
| `server/src/i18n/get-strapi-texts.ts` | merges them; `getStrapiTexts(locale)` |

Each pair is suffixed after the app it belongs to — `-client` for Next.js, `-strapi` for
the backend — so the two are never mistaken for one another. They are separate
dictionaries that happen to share a mechanism, and each app's three files sit together.

On both sides the dictionary type is derived from the Hungarian file, so a key cannot
exist in a translation without existing in Hungarian first, and `withFallback` overlays
English on Hungarian — a **missing English key silently falls back to Hungarian** rather
than breaking.

| Context | Helper |
| --- | --- |
| Client Component | `useTexts()` |
| Server Component | `getTexts(await getRequestLocale())` |
| Strapi controller / lifecycle | `getStrapiTexts(readRequestLocale(ctx))` |

### How the locale reaches Strapi

The Next.js server actions attach an **`x-locale` header** to every submit they send to
Strapi (`localeHeader()` in `client/src/data/services.ts` — contact request, event signup,
newsletter signup). Strapi reads it in `readRequestLocale()`, so a form filled in on the
English site produces an English confirmation e-mail and English API errors.

The dictionary is resolved **once per e-mail** and threaded into the templates as `t`, so
every string in one message comes from the same language. Templates never import from
`texts-strapi.ts` directly.

A newsletter signup is created through a lifecycle hook, which gets no `ctx` of its own —
it reads the running request from `strapi.requestContext.get()` (AsyncLocalStorage).

Anything without that header falls back to Hungarian: the Strapi admin, a direct API call,
and every case listed below.

### Where the language cannot be known

| Case | Why | What happens |
| --- | --- | --- |
| Password reset, e-mail confirmation | Strapi stores one template per e-mail *type* and picks it by type, never by recipient; a reset request carries only an address | Sent **bilingual** — Hungarian, a divider, then English |
| Newsletter broadcast | A newsletter signup stores only an e-mail address | Default locale |
| Unsubscribe landing page | Reached from a link in one of those newsletters | Default locale |

The bilingual templates are generated by the scripts in
`server/src/lib/email/templates-of-strapi-emails/` and pasted into the Strapi admin
(Settings → Users & Permissions → Email templates). They call `getStrapiTexts("hu")` and
`getStrapiTexts("en")` and render both halves. Their subject lines carry both languages
too, via `SYSTEM_EMAIL_SUBJECT_BILINGUAL`.

### Not translated on purpose

`SITE_NAME` / `EMAIL_DEFAULT_FROM_NAME` — a brand name, identical in every language — and
`SYSTEM_EMAIL_SUBJECT_BILINGUAL`, which already carries both.

### Values that are stored, not shown

Some strings are persisted on a record and compared against form state, so they must mean
the same thing in every language. Only their **label** is translated.

| Data | Stored value | Where the label comes from |
| --- | --- | --- |
| Country of birth, billing country | Hungarian country name | `getEuropeanCountries(locale)` — `client/src/utils/european-countries.ts` |
| Document type, "other" country | `SIGNUP_DOCUMENT_TYPE_*`, `SIGNUP_BIRTH_COUNTRY_OTHER` | the same keys, via `useTexts()` |

`european-countries.ts` keeps one row per country — the stored Hungarian `value` and an
`en` label — and returns them sorted by the visible label, so the dropdown reads
alphabetically in whichever language is shown. `DEFAULT_COUNTRY` is a stored value, so it
stays Hungarian everywhere.

This is why the admin notification e-mail prints Hungarian country names even for a signup
made on the English site: it prints what was stored.

---

## 4. Dates and numbers

A date is not a dictionary string — nothing about it is written by hand — but it *is*
language-dependent, because `Intl` renders the month and weekday names. One helper owns
all of it.

| Piece | Where |
| --- | --- |
| `formatDate(dateString, locale)` | `client/src/utils/format-date.ts` |
| `INTL_LOCALE` — the BCP-47 tag per locale | `client/src/i18n/config.ts` |

```
hu   formatDate("2026-05-06", "hu")  ->  2026. május 6., szerda
en   formatDate("2026-05-06", "en")  ->  Wednesday 6 May 2026
```

**`locale` is a required parameter, deliberately.** It has no default. A call site that
forgets it is a compile error rather than a Hungarian date quietly rendered on the English
site — which is exactly how this was broken before: the helper had `"hu-HU"` hard-coded
inside it, so every one of the sixteen call sites below printed Hungarian in both locales
and nothing complained.

The locale is fetched the same way as the texts, from the same two helpers:

| Context | Call |
| --- | --- |
| Server Component | `formatDate(value, await getRequestLocale())` |
| Client Component | `formatDate(value, useLocale())` |

### Why `en-GB` and not `en-US`

`INTL_LOCALE` maps `en` to **`en-GB`**, so a date reads `6 May 2026` — day before month,
matching the Hungarian order and what a European audience expects. `en-US` would give
`May 6, 2026`. This is a regional convention, which is why it is a separate map and not
just the locale code: adding a locale means deciding its formatting region too.

### Where dates are shown

| Place | Dates |
| --- | --- |
| `components/EventsSignupForm.tsx` | tour start, end, registration deadline |
| `components/TourSignupDialog.tsx` | dialog title, summary step schedule |
| `components/Card.tsx` | every list card — tours, reports, blog |
| `app/[locale]/blog/[slug]/page.tsx` | published date |
| `app/[locale]/reports/[slug]/page.tsx` | published date |
| `app/[locale]/profile/page.tsx` | start date of each tour signed up for |
| `app/[locale]/profile/SignupDetailsToggle.tsx` | birth / document issue / expiry, own and companions' |

### Not formatted on purpose

**`<input type="date">` fields** in the signup dialog. The browser renders and parses these
in *its own* locale, not the site's, and that cannot be overridden. Their `value` is always
ISO (`1985-03-15`), which is what gets stored — so the stored value is language-neutral,
same principle as §3's "values that are stored, not shown".

**Machine-readable dates** — `<time datetime>`, canonical metadata, sitemap entries — stay
ISO. They are read by crawlers, not people.

### The Strapi side

**No Strapi e-mail prints a formatted date today.** The audit:

| What | Status |
| --- | --- |
| `© 2026` in every e-mail footer | `new Date().getFullYear()` — a bare number, identical in every language |
| Birth / document dates in the admin signup e-mail | raw ISO, straight from the `type="date"` input — see above |
| The user's confirmation e-mail | prints the tour **title** and price, no date |

So there is no server-side `formatDate` and no `INTL_LOCALE` in the Strapi dictionaries —
adding either now would be dead code.

> **If you ever add a date to an e-mail, it needs the same treatment.** The trap is already
> laid: `event.startDate` is selected in
> `server/src/api/event-signup/controllers/event-signup.ts` but never used, so the value is
> sitting right there for whoever decides the confirmation e-mail should mention when the
> tour starts. The locale is available — `readRequestLocale(ctx)` already resolves it for
> `t` — so the correct move is to mirror `INTL_LOCALE` into the Strapi dictionaries and
> format with it, **not** to reach for `"hu-HU"`.

### Numbers

Prices are formatted with a hard-coded `"hu-HU"` in three client components and one e-mail
template, so an English page shows `90 000` where `90,000` is expected. This is the same
bug class as the dates and is listed under §10.

---

## 5. Strapi page slugs referenced from code

These are content, not routes. Each locale stores its own value, and the matching page
**must exist in Strapi under exactly this slug** — there is no fallback to Hungarian.

| Key | `hu` | `en` | Used by |
| --- | --- | --- | --- |
| `TERMS_LINK` | `/aszf` | `/terms` | `RegisterForm`, `TourSignupDialog` |
| `PRIVACY_LINK` | `/adatvedelem` | `/privacy-policy` | `RegisterForm`, `TourSignupDialog` |
| `TRAVEL_CONTRACT_LINK` | `/utazasi-szerzodes` | `/travel-contract` | `TourSignupDialog` |
| `REPORTS_PAGE_SLUG` | `beszamolok` | `reports` | `reports/page.tsx` — loads the section's blocks |
| `BLOG_PAGE_SLUG` | `blog` | `blog` | `blog/page.tsx` — loads the section's blocks |

The last two are not links. The section routes render blocks stored on a Strapi **page**
with that slug, so the slug has to follow the locale too.

The backend needs the contract slug independently — it reads the page and builds a DOCX —
so `TRAVEL_CONTRACT_SLUG` is a key in the Strapi dictionaries too, Hungarian and English.
**This value is duplicated between client and server.** If they drift,
`getTravelContractAttachment` logs a `strapi.log.error` and the confirmation e-mail goes
out without the contract attached.

> A slug must never collide with a `Route` member. A page saved under the slug
> `tours` would be translated to `turaink` by `toPublicPath` and 404.

---

## 6. Localized content types

| Content type | i18n | Notes |
| --- | --- | --- |
| `article`, `blog`, `event` | yes | title, description, slug, blocks |
| `global` | yes | header/footer — **navigation hrefs are per locale**; `showLanguageSwitcher` is the one field on it that is *not* localized, see §8 |
| `home-page` | yes | |
| `page` | yes | |
| `site-setting` | no | bank details, organisation name — language-neutral |
| `newsletter`, `newsletter-signup`, `contact-request`, `event-signup` | no | submitted data, not content |

Every loader in `client/src/data/loaders.ts` sends `locale`. Strapi ignores the parameter
for the non-localized types, so it is safe to send everywhere.

---

## 7. Request plumbing

`client/src/proxy.ts` (Next 16's renamed `middleware`) resolves the locale from the URL and
rewrites onto the physical route tree. It sets two **request** headers — not response
headers, so that `headers()` in a Server Component can read them:

| Header | Read by |
| --- | --- |
| `x-locale` | `getRequestLocale()` in `client/src/data/locale.ts` |
| `x-public-path` | canonical / hreflang tags |

The rewrite is internal, so the address bar keeps the public URL, which is what
`usePathname()` reports — the language switcher and every link work off it.

A `/hu/...` URL is 308-redirected to the unprefixed form, so each page is reachable under
exactly one URL.

---

## 8. Hiding the language switcher

`showLanguageSwitcher` — a boolean on the Strapi **Global** single type — decides whether
the header offers a language at all. It is read in `app/[locale]/layout.tsx` (which already
fetches the global settings, so this costs no extra request) and passed to `<Header>`,
which drops the `navbar__language` list item when it is off.

**It is a display flag, nothing more.** `/en` keeps working when it is off: the routes, the
proxy rewrite and every `toPublicPath()` call are untouched, and an existing `/en` link
still resolves. Turning it off hides the door, it does not lock it. Blocking the English
tree outright is a separate job — the cheapest place would be this same layout, since the
flag is already in hand there.

### Two things about this field

**It is deliberately not localized.** `global` is an i18n content type, so by default every
field on it exists once per locale — and a site-wide "do we offer languages" switch whose
value depends on which language you are already looking at is a contradiction. The
attribute therefore carries `"i18n": { "localized": false }`, which makes Strapi share one
value across all locales. This is the only field on `global` that works this way.

**A missing value means hidden.** The switcher is **opt-in**: the schema default is
`false`, and the loader and the `Header` prop both fall back to `false` too, so every path
that produces no value lands on hidden —

| Case | Result |
| --- | --- |
| `global` record saved before the field existed (`undefined`) | hidden |
| Field never touched in the admin | hidden |
| Settings fetch fails and the loader hits its `catch` | hidden |
| `<Header>` rendered without the prop | hidden |

— which means **the switcher does not appear until somebody ticks the box in Strapi.** That
is the deliberate choice: an English site that is half-translated should not advertise
itself, so offering the language is an explicit act rather than something that happens by
default.

> Turning it off while a visitor is on `/en` leaves them on the English site with no UI to
> get back. That is the intended behaviour of a display-only flag, but it is worth knowing
> before flipping it on a live site.

---

## 9. What has to be done in Strapi, by hand

1. **English translations of the pages** referenced in §5 — `aszf`, `adatvedelem`,
   `utazasi-szerzodes`, `beszamolok` — saved under exactly the English slugs listed there.
   Until they exist, the English pages 404.
2. **Navigation hrefs in physical form.** They currently read `/turaink` and `/beszamolok`
   in both the Hungarian *and* the English `global`. They need to be `/tours` and
   `/reports`, the same in both.
3. **Content links per locale.** The English `global` currently points "Terms and
   Conditions" at `/aszf`; it needs `/terms`, because nothing translates it.

---

## 10. Known gaps

- **`client/src/app/global-error.tsx` links to `/` unlocalized.** It lives outside
  `[locale]` and replaces the root layout when that layout crashes, so there is no locale
  context and no request header to read. `/` is the correct fallback.
- **The reverse mapping is not strict.** `toPhysicalSegments` falls back to the segment it
  was given, so `/en/turaink` still serves the tours page alongside `/en/tours` — each page
  is reachable under two URLs, which search engines see as duplicate content. Fixing it
  means 308-redirecting a segment that belongs to another locale and 404-ing unknown ones.
- **A content link in Strapi is missing its leading slash.** The "Data privacy" entry reads
  `adatvedelem`, not `/adatvedelem`. `toPublicPath` returns anything not starting with `/`
  untouched, so it goes out as a relative URL. This predates the localization work.
- **Prices are formatted with a hard-coded `"hu-HU"`.** `toLocaleString("hu-HU")` in
  `TourSignupDialog.tsx` (twice), `SignupDetailsToggle.tsx` and the server's
  `templates/event-signup.ts`, so the English site groups thousands the Hungarian way:
  `90 000` instead of `90,000`. The dates were fixed the same way `INTL_LOCALE` fixes
  this — see §4.
- **`yarn lint` is broken**, unrelated to localization: `client/eslint.config.mjs` uses
  `tseslint` on line 9 without importing it, so the config fails to load for any file.
- **The generated admin templates print `undefined` in their footer.** The scripts in
  `templates-of-strapi-emails/` call `emailFooter()` without an organisation name, so the
  copyright line reads "© 2026 undefined". Predates the localization work; the fix is to
  pass the name from the site settings.
- **The contract slug lives in two dictionaries.** `TRAVEL_CONTRACT_SLUG` exists on both
  the client and the Strapi side, with nothing linking them — see §5.
