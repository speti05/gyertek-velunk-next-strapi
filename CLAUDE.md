# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Gyertek Velunk** is a Hungarian-language full-stack web application for events, articles, and tours. It is a Yarn-workspaces monorepo with two apps:
- `client/` — Next.js 16 frontend (React 19, App Router)
- `server/` — Strapi 5 CMS backend (SQLite by default)

## Development Commands

All commands use Yarn. Run from the repo root unless noted.

### Setup
```bash
yarn setup          # Install deps + copy .env.example → .env for both apps
```

### Development
```bash
yarn dev            # Start both client (port 3000) and server (port 1337) concurrently
yarn client         # Start only the Next.js dev server
yarn server         # Start only the Strapi dev server
```

### Build
```bash
cd client && yarn build   # Build Next.js for production
cd server && yarn build   # Build Strapi admin panel
```

### Lint
```bash
cd client && yarn lint       # ESLint + Stylelint on src/ (lint:js / lint:css run them separately)
cd server && yarn lint       # ESLint (type-aware typescript-eslint)
cd server && yarn typecheck  # tsc --noEmit
cd e2e && yarn typecheck     # tsc on the tests, support files and scripts/*.mjs
```

The VS Code launch compound **Lint (client + server)** runs all of these. The client configs enforce the project conventions: MUI imports only inside `custom-ui-components/` (plus the theme provider and `sass/mui-override/`), no Tailwind colour utilities, and no colour literals in TS/TSX or SCSS/CSS outside `_colors.scss`.

### E2E tests and user docs
```bash
yarn setup:e2e && yarn setup:docs   # Install Playwright (+ Chromium) and Starlight
yarn e2e            # Playwright suite on its own Strapi (:1338, on a DB copy) + client (:3001)
yarn e2e:no-content # The same on the no-content test database
yarn e2e:snapshot   # Rebuild e2e/fixtures/*.db from the dev database (after schema/content changes)
yarn docs:dev       # Build coverage.json from the last e2e run, then serve the docs
```

- `e2e/` — Playwright tests. They never write to the dev database: `e2e/scripts/start-strapi.mjs` copies a committed fixture (`e2e/fixtures/data.db`, or `data-no-content.db` with `--db no-content`; personal data stripped by `scripts/build-test-dbs.mjs`) to `server/.tmp/e2e/` and `e2e/scripts/run.mjs` (behind `yarn test` / `yarn test:ui`) deletes the copy after the run. Each test is tagged with the use case it covers via `useCase("UC-XXX-00")` (`e2e/support/docs.ts`); `docScreenshot()` saves images into the docs. Assert against `getTexts("hu")`, never literal strings.
- E-mails in e2e: the test Strapi gets `EMAIL_OUTBOX_DIR`, and every mail sent through `sendMailWithRetry` is also saved there as JSON (`server/src/lib/email/outbox.ts`; inline images as data URIs). It also gets `EMAIL_DELIVERY=outbox`, so no mail leaves the machine (both transports become nodemailer's `jsonTransport`) and the tests need no network or open SMTP port; run with `E2E_EMAIL_DELIVERY=ethereal` to send them to Ethereal too (adds the preview link). Tests read it with `waitForMail()` from `e2e/support/outbox.ts` and assert against `getStrapiTexts("hu")` (`@server/i18n/get-strapi-texts`). The Strapi system mails (e-mail confirmation, password reset) are captured too, by the `email` plugin wrapper in `server/src/index.ts`. Mails sent with a plain `transporter.sendMail` (event signup, newsletter) do not reach the outbox yet.
- Auth in e2e: the fixture databases hold no users, so each test creates its own account (`createConfirmedUser()` / `createUnconfirmedUser()` in `e2e/support/auth.ts`, through the Strapi API + the confirmation link from the outbox). The test Strapi runs with `AUTH_RATE_LIMIT_DISABLED=true`, which turns off both our limits (`auth-overrides.ts`) and the users-permissions plugin's own limiter (`server/config/plugins.ts`; 5 logins / password resets per 5 min per IP), since every auth request comes from the one Next.js server; never set it anywhere else.
- `docs-site/` — Astro Starlight user docs (Hungarian), published to GitHub Pages by `.github/workflows/docs.yml`. A page lists its use cases in the `usecases` frontmatter and shows `<TestCoverage id="..." />` / `<Screenshot name="..." />`.
- `scripts/build-coverage.mjs` joins the two on the use case ID; `--strict` fails on untested or undocumented use cases.

**Schema change → refresh the test databases.** Whenever a Strapi schema changes (`server/src/api/*/content-types/` or `server/src/components/`), regenerate the committed fixtures as part of the same change:

1. Start the dev Strapi once with the new schema, so `server/.tmp/data.db` is migrated.
2. If a new type holds personal data, add its table to `PRIVATE_TABLES` in `scripts/build-test-dbs.mjs` first (the repo is public).
3. Run `yarn e2e:snapshot` → rebuilds `e2e/fixtures/data.db` and `e2e/fixtures/data-no-content.db`.
4. Verify with `yarn e2e` and `yarn e2e:no-content`, and commit the fixtures with the schema change.

### Database
```bash
yarn seed           # Import seed data into Strapi (from seed-data.tar.gz)
yarn export         # Export current database as seed data
```

### Docker
```bash
docker-compose -f docker-compose.local.yml up   # Local Docker environment
docker-compose up                                # Production Docker environment
```

## Architecture

### Data Flow
Next.js fetches content from Strapi's REST API. The client uses `qs` for query string building and Zod for response validation. In Docker, the client calls Strapi via the internal Docker network; locally it uses `localhost:1337`.

### Client (`client/src/`)
- **App Router** with route groups. Dynamic `[slug]` handles generic pages; named routes handle `beszamolok` (articles/reports) and `turaink` (tours).
- **Styling stack**: SASS (`sass/`) for base styles + Tailwind CSS v4 for utilities + Material UI v7 for component library. MUI overrides live in `sass/mui-override/`.
- **Path alias**: `@/*` maps to `src/*`; `@clientRoot/*` maps to the client project root.
- **Providers** (`src/components/providers/`) wrap the app with React Context (e.g., reCAPTCHA v3, theme).
- **Blocks** (`src/components/blocks/`) are content-type-driven components that render Strapi block data.

#### Colors (client)
`client/src/sass/base/_colors.scss` is the single source of truth for every colour on the client. No colour literal may appear anywhere else — not in SCSS, not in CSS, not in TSX, not in a Tailwind class.

- **SCSS/CSS**: `@use "<path>/base/colors";` and reference `colors.$gy-v-*`. For a translucent black or white overlay use the `colors.scrim($alpha)` / `colors.veil($alpha)` helpers instead of writing `rgba(0, 0, 0, …)`; for a translucent brand colour use `rgba(colors.$gy-v-<token>, $alpha)`.
- **TypeScript/TSX** (MUI theme, inline SVG fills, `sx` props): import `{ palette }` from `@/sass/base/colors.generated`. That file is generated from `_colors.scss` by `client/scripts/generate-color-tokens.mjs`, which runs automatically on `yarn dev` and `yarn build` (or manually via `yarn generate:colors`). Never edit it by hand.
- **Tailwind**: colour utilities (`bg-white`, `text-slate-800`, `border-gray-300`, `bg-[#79C2B6]`, …) are not allowed. Keep layout utilities in Tailwind and move the colour into a CSS module class that reads from the palette.
- Plain CSS files cannot reach the palette, so document-level colour variables are declared in `sass/base/_base.scss` and consumed as `var(--background)` / `var(--foreground)`.

Need a colour that does not exist yet? Add a token to `_colors.scss` — do not inline the value.

### Server (`server/src/`)
- **Content types** (in `src/api/`): `article`, `event`, `event-signup`, `global`, `home-page`, `newsletter-signup`, `page`.
- **Components** (in `src/components/`): `blocks`, `elements`, `layout` — shared Strapi component schemas used across content types.
- **Database**: SQLite in development (`.tmp/data.db`); configurable for MySQL/PostgreSQL via environment variables.
- **Email**: Nodemailer (Gmail SMTP by default), configured in `server/config/`. In development (`NODE_ENV=development`, also the e2e runs) every e-mail goes to the Ethereal account in `ETHEREAL_USER` / `ETHEREAL_PASS` instead (`src/lib/email/ethereal.ts`).
- **Plugins**: `@strapi/plugin-users-permissions`, `@offset-dev/strapi-calendar`.

### Environment Files
- `server/.env` — Strapi secrets (APP_KEYS, JWT secrets, DB config, SMTP). Copy from `server/.env.example`.
- `client/.env.local` — Strapi API URL and the site's own public URL (`NEXT_PUBLIC_SITE_URL`). Copy from `client/.env.local.example`.
- Root `.env` — reCAPTCHA secret key (used by server-side Next.js routes).

The `copy-env.mts` utility at the root automates copying `.env.example` → `.env` during `yarn setup`.

### Docker
- Both services have multi-stage Dockerfiles based on `node:24-alpine`.
- Client uses Next.js standalone output for minimal image size.
- `docker-compose.yml` (production) uses `.env.production`; `docker-compose.local.yml` uses `.env`.
- Strapi uploads and database are persisted via Docker volumes.
