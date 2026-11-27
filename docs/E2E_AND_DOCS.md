# E2E tests and user docs

How the Playwright end-to-end tests and the Hungarian user guide fit together, which file
does what, and how to add a new documented, tested use case.

---

## 1. The idea in one line

Every user-facing flow gets a **use case ID** (`UC-NEWS-01`). The e2e test that plays the
flow through on the real site is tagged with that ID, and the user guide page that describes
the flow lists it too. A script joins the two, so every page of the guide shows whether its
steps passed on the last run, and the screenshots in the guide are taken by the tests
themselves, which keeps them up to date.

```
 e2e/tests/**/*.spec.ts                         docs-site/src/content/docs/**/*.mdx
 ─────────────────────                          ───────────────────────────────────
 test("…", useCase("UC-NEWS-01"), …)            usecases: [UC-NEWS-01, …]   (frontmatter)
   │  docScreenshot(…, "UC-NEWS-01-form")         <TestCoverage id="UC-NEWS-01" />
   │                                              <Screenshot name="UC-NEWS-01-form" />
   ▼                                                        ▲            ▲
 e2e/test-results/results.json ──┐                          │            │
 (Playwright JSON reporter)       │                          │            │
                                  ▼                          │            │
                     scripts/build-coverage.mjs ──► docs-site/src/data/coverage.json
                                                                          │
 docScreenshot() ─────────────────────────────► docs-site/src/assets/screenshots/*.png
```

---

## 2. The pieces

| Path | What it is |
|---|---|
| `e2e/` | A standalone Yarn package with the Playwright tests. It is not part of the client or server dependencies. |
| `docs-site/` | A standalone Yarn package: the user guide, built with **Astro** + **Starlight**. |
| `scripts/build-coverage.mjs` | Joins test results and docs pages on the use case ID and writes `coverage.json`. |
| `.github/workflows/docs.yml` | CI: runs the tests on the committed test database, builds the guide and publishes it to GitHub Pages. |
| `package.json` (root) | `setup:e2e`, `setup:docs`, `e2e`, `e2e:ui`, `docs:coverage`, `docs:dev`, `docs:build` scripts. |
| `.vscode/launch.json` | `E2E: …` run configurations. |

### Astro and Starlight

- **Astro** is a static site generator. It turns `.md`/`.mdx` files and `.astro`
  components into plain HTML at build time. The published site has no server.
- **Starlight** is Astro's documentation theme and integration. It provides the sidebar,
  search, light/dark mode, the `:::tip` callouts, `<Badge>` and the splash home page.
  Pages are Markdown/MDX files under `docs-site/src/content/docs/`. The URL follows the
  file path (`hirlevel/feliratkozas.mdx` → `/hirlevel/feliratkozas/`).
- **MDX** is Markdown that can import and use components. That is how a page embeds
  `<TestCoverage>` and `<Screenshot>`.
- **sharp** is the image library Astro uses to optimise the screenshots during the build.

---

## 3. `e2e/`: the Playwright tests

```
e2e/
├── package.json          # @playwright/test; scripts: test, test:ui, report, install:browsers
├── playwright.config.ts  # projects, reporters, web servers
├── tsconfig.json         # "@client/*" → ../client/src/*  (to reuse the site's texts)
├── scripts/
│   ├── e2e-db.mjs        # where the database copy lives
│   ├── start-strapi.mjs  # copies the database, starts Strapi on the copy
│   └── run.mjs           # runs Playwright, then deletes the copy (behind `yarn test`)
├── support/
│   ├── docs.ts           # useCase(), docScreenshot()
│   └── site.ts           # hu texts, acceptCookies(), uniqueEmail()
└── tests/
    └── newsletter/subscribe.spec.ts
```

### `playwright.config.ts`

- **Projects:** every test runs twice, as `desktop` (Desktop Chrome) and `mobile` (Pixel 7).
- **Reporters:** `list` for the terminal, `html` (`playwright-report/`, opened with
  `yarn report`), and `json` → `test-results/results.json`, which is the input for
  `build-coverage.mjs`.
- **`webServer`:** every run starts **its own** Strapi and client, next to (not instead of)
  a running `yarn dev`. They are stopped when the run ends.

  | | Dev (`yarn dev`) | E2E run |
  |---|---|---|
  | Strapi | `:1337`, `server/.tmp/data.db` | `:1338`, `server/.tmp/e2e/data.db` (a copy) |
  | Client | `:3000`, `client/.next/` | `:3001`, `client/.next-e2e/` |

  - Strapi is started by `scripts/start-strapi.mjs` (`strapi start`, after a `tsc` so
    `dist/` is current). The client gets `STRAPI_API_URL` / `NEXT_PUBLIC_STRAPI_URL`
    pointing at `:1338`, and `NEXT_DIST_DIR=.next-e2e` (read in `client/next.config.ts`),
    so its cache does not clash with the dev server's.
  - **Locally** the client runs as `next dev`. The first run compiles from scratch and is
    slower.
  - **In CI** the client runs as `yarn build && yarn start`. The order matters: the client
    build pre-renders pages from Strapi content.
  - **No e-mail leaves a test run, and by default none is even sent.** See
    [E-mails and the Ethereal account](#e-mails-and-the-ethereal-account) below.

### E-mails and the Ethereal account

[Ethereal](https://ethereal.email) is a fake SMTP service: it accepts every e-mail, delivers
none, and shows them in a web inbox (https://ethereal.email/messages, log in with the account).
**The tests do not use it** unless you ask for it:

| Where | `EMAIL_DELIVERY` | What happens to an e-mail | Ethereal account used? |
|---|---|---|---|
| `yarn e2e` / `yarn e2e:ui` (default), locally and in CI | `outbox` | Saved as JSON to `server/.tmp/e2e/outbox/`, then "sent" by nodemailer's `jsonTransport`, which goes nowhere | **No** |
| `E2E_EMAIL_DELIVERY=ethereal yarn e2e` | not set | Saved to the outbox **and** sent to Ethereal; the report gets an `Ethereal` preview link per mail | **Yes**, `ETHEREAL_USER` / `ETHEREAL_PASS` from `server/.env` |
| `yarn dev` (Strapi with `NODE_ENV=development`) | not set | Sent to Ethereal, no outbox | **Yes**, see below |
| Production | not set | Sent through the real SMTP server (`SMTP_*`) | No |

- **The outbox** (`server/src/lib/email/outbox.ts`) holds every mail sent through
  `sendMailWithRetry` (contact request) and every Strapi system mail (e-mail confirmation,
  password reset - the email plugin wrapper in `server/src/index.ts`). The tests read it with
  `waitForMail()` (`e2e/support/outbox.ts`). Mails sent with a plain `transporter.sendMail`
  (event signup, newsletter) are not saved there yet, but are not sent either.
- **Why not Ethereal by default:** the tests would need the network and an open outgoing SMTP
  port (587). Some networks block it, and Strapi sends the e-mail confirmation inside the
  register request, so a mail that cannot be sent fails the registration itself.
- **The Ethereal account only matters in `yarn dev`** (and in the opt-in e2e mode above).
  With `ETHEREAL_USER` / `ETHEREAL_PASS` set in `server/.env`, every dev e-mail goes to that
  account. Without them our own e-mails go to a throwaway account created on each start (its
  login is printed to the Strapi log), **but the Strapi system e-mails (confirmation, password
  reset) fall back to the real `SMTP_*` settings** (`server/config/plugins.ts`) - keep the
  account set if `server/.env` holds live SMTP credentials.
- **CI has no Ethereal account** (`.github/workflows/docs.yml` sets none). Setting
  `E2E_EMAIL_DELIVERY=ethereal` there would create a throwaway account for our own e-mails,
  and the Strapi system e-mails would fail on the closed `SMTP_HOST` port.

### The database copy

1. `scripts/start-strapi.mjs` deletes any leftover copy, then copies the source database to
   `server/.tmp/e2e/data.db` with SQLite's backup API. The source is one of the committed
   fixtures, the same locally and in CI (see below).
2. The tests write only to the copy. The dev data never changes.
3. `scripts/run.mjs` deletes `server/.tmp/e2e/` once Playwright has exited and stopped the
   servers. A `globalTeardown` would be too early: it runs before the servers stop, and
   Windows does not let a file go while Strapi holds it open.

Run the suite through `yarn test` / `yarn test:ui` (or the root `yarn e2e` / `yarn e2e:ui`).

### The test databases (`e2e/fixtures/`)

| File | Content | Run with |
| --- | --- | --- |
| `data.db` (default) | Every piece of content: pages, articles, blogs, events, newsletters, media library | `yarn e2e` |
| `data-no-content.db` | Only what the site needs to come up: pages, global / home page / site settings, media library | `yarn e2e:no-content` (or `yarn test --db no-content` in `e2e/`) |

`--db` also takes a path relative to the repo root, e.g. `yarn test --db server/.tmp/data.db`
runs against a copy of the dev database (the same as `E2E_DB=...`).

Both are committed, and the repo is public, so they hold **no personal data or credentials**:
admin and end users, signups, contact requests, sessions, API / transfer tokens and the
content history are emptied. There is no admin user in them; open the e2e Strapi admin and
it asks you to register one. The media files are not in the database (they live in
`server/public/uploads`, which is not committed), so in CI the images do not load.

**Refresh them** whenever the schema or the test content changes - the schema must match
the code, or Strapi has to migrate on start:

```bash
yarn e2e:snapshot   # scripts/build-test-dbs.mjs: server/.tmp/data.db → e2e/fixtures/*.db
```

The script works from the content-type and component schemas in `server/src`, so a new
content type is handled without changes. A new type holding personal data must be added to
`PRIVATE_TABLES` in the script.
Calling `npx playwright test` directly (or the VS Code Playwright extension) skips
`run.mjs`. The tests still run on a copy, but it stays on disk until the next run replaces it.

### `support/docs.ts`

- **`useCase("UC-NEWS-01")`** returns `{ tag: "@UC-NEWS-01" }`, the test's use case tag.
  Pass it as the second argument of `test()`. Run one use case with
  `yarn test --grep @UC-NEWS-01`.
- **`docScreenshot(target, name)`** takes a screenshot of a page or locator, attaches it to
  the HTML report, and writes it to `docs-site/src/assets/screenshots/<name>.png`. It writes
  the file only from the `desktop` project, so the two projects do not overwrite each other.
  Mobile screenshots end up in the report only.

### `support/site.ts`

- **`hu`** is `getTexts("hu")` from the client's own i18n module. **Tests assert against
  these texts and never against string literals**, so a copy change on the site does not
  break the tests.
- **`acceptCookies(page)`** clicks **Elfogadom** on the site's own cookie banner
  (`.cookie-banner`, rendered by `CookieConsentBanner.tsx`). vanilla-cookieconsent's
  `#cc-main` modal runs with `autoShow: false`, so it never appears. The helper then waits
  for reCAPTCHA (see below).
- **`uniqueEmail()`** returns a unique, undeliverable `@example.com` address, so reruns never
  hit the unique-email constraint.

#### Why the tests wait for `body[data-recaptcha-ready]`

reCAPTCHA only loads after the visitor consents to cookies. A form submitted before it is
ready opens the cookie preferences instead of submitting (`use-recaptcha-submit.ts`).
`RecaptchaBridge` in `client/src/components/recaptcha-provider.tsx` sets
`data-recaptcha-ready` on `<body>` in an effect, after React has committed
`executeRecaptcha` to every form, and `acceptCookies()` waits for it. Waiting for
`grecaptcha.ready()` alone is not enough: React has not re-rendered yet at that point.

---

## 4. `docs-site/`: the user guide

```
docs-site/
├── astro.config.mjs        # Starlight config: title, hu locale, sidebar, GitHub Pages base path
├── package.json            # astro, @astrojs/starlight, sharp; scripts: dev, build, preview
└── src/
    ├── content.config.ts   # extends the page frontmatter with `usecases: string[]`
    ├── content/docs/
    │   ├── index.mdx               # splash home page
    │   ├── lefedettseg.mdx         # "Tesztlefedettség": the full coverage table
    │   └── hirlevel/feliratkozas.mdx
    ├── components/
    │   ├── TestCoverage.astro      # one use case: ID + status badge + links to its tests
    │   ├── CoverageTable.astro     # every use case: status, docs page, tests
    │   └── Screenshot.astro        # embeds screenshots/<name>.png, or a "missing" note
    ├── data/
    │   ├── coverage.ts             # typed loader for coverage.json + badge labels/colours
    │   └── coverage.json           # GENERATED by build-coverage.mjs (git-ignored)
    └── assets/screenshots/*.png    # GENERATED by docScreenshot() (git-ignored)
```

- **`astro.config.mjs`:** the site is published at
  `https://speti05.github.io/gyertek-velunk-next-strapi/`, so `base` is the repo name.
  Sections are added to `sidebar`. `autogenerate` lists every page in a folder.
- **`content.config.ts`:** adds the optional `usecases` frontmatter field and validates the
  ID format (`UC-<AREA>-<number>`). A typo fails the build.
- **`coverage.ts`:** loads `coverage.json` through `import.meta.glob`, so the site still
  builds when the file does not exist yet (no tests run on this machine). The components then
  show "Nincs teszt" and the screenshots show a "missing" note.
- **The generated files are not committed.** Screenshots and coverage always come from a test
  run, locally or in CI.

---

## 5. `scripts/build-coverage.mjs`

1. Reads `e2e/test-results/results.json` and collects every test with a `@UC-…` tag. For
   each test it records the title, file, a GitHub link to the exact line, and the status
   folded across projects. The worst status wins: `failed` > `flaky` > `passed` > `skipped`.
2. Reads the `usecases` frontmatter of every page under `docs-site/src/content/docs`.
3. Writes `docs-site/src/data/coverage.json`, keyed by use case ID:
   `{ status, docs: [pages], tests: [...] }`. A use case with a page but no test is
   `untested`.
4. Prints the use cases that are **documented but not tested**, and those **tested but not
   documented**. With `--strict` either one exits with an error. CI does not pass
   `--strict` yet.

GitHub links use `GITHUB_REPOSITORY` / `GITHUB_REF_NAME` in CI. Locally they fall back to
`speti05/gyertek-velunk-next-strapi` on `main`.

---

## 6. Running it locally

One-time setup (Playwright + Chromium, and Astro/Starlight):

```bash
yarn setup:e2e
yarn setup:docs
```

Day to day. `yarn dev` may or may not be running, the tests start their own servers:

```bash
yarn e2e        # all tests, headless (desktop + mobile)
yarn e2e:ui     # Playwright UI mode: pick, run, step through and time-travel tests
yarn docs:dev   # build coverage.json from the last run, then serve the guide (localhost:4321)
yarn docs:build # same, but a static build into docs-site/dist
```

Inside `e2e/`: `yarn report` opens the last HTML report, and `yarn test --headed` /
`yarn test --project=desktop` / `yarn test --grep @UC-NEWS-01` narrow a run.

VS Code (**Run and Debug**):

| Configuration | Does |
|---|---|
| E2E: All tests (headless) | `yarn test` |
| E2E: Current file (headed) | Runs the open spec file in a visible browser |
| E2E: UI mode | `yarn test:ui` |
| E2E: Show last report | `yarn report` |

> The guide only shows the screenshots and badges of the **last test run on this machine**.
> Run `yarn e2e` before `yarn docs:dev`, or the pages will say the screenshots are missing.

---

## 7. CI and publishing (`.github/workflows/docs.yml`)

Triggers: push to `main`, every pull request, and manual runs.

1. Installs the server, client, e2e and docs-site dependencies.
2. Writes a throwaway `server/.env` with random secrets. There is no Ethereal account and the
   SMTP host is a closed port: the run's e-mails only go to the outbox (see
   [E-mails and the Ethereal account](#e-mails-and-the-ethereal-account)).
3. Builds Strapi. There is no seeding: the run starts from the committed `e2e/fixtures/data.db`.
4. Typechecks `e2e/`, installs Chromium and runs `yarn test`. Playwright starts Strapi on a
   copy of the fixture, then builds and starts the client.
5. Uploads the Playwright HTML report as the `playwright-report` artifact (14 days).
6. **Even when a test failed:** builds `coverage.json`, builds the guide, and copies the
   HTML report to `dist/report/`. That way the published coverage page shows the failure.
7. **On `main` only:** publishes `docs-site/dist` to GitHub Pages. On pull requests the
   guide is built but not published.

One-time repo setting: **Settings → Pages → Source: GitHub Actions**.

Published URLs:

- Guide: `https://speti05.github.io/gyertek-velunk-next-strapi/`
- Coverage table: `…/lefedettseg/`
- Last Playwright report: `…/report/`

---

## 8. Adding a new use case

1. **Pick an ID**: `UC-<AREA>-<NN>`, for example `UC-TOUR-01`. Keep one area per feature.
2. **Write the test** under `e2e/tests/<area>/`:

   ```ts
   import { expect, test } from "@playwright/test";
   import { docScreenshot, useCase } from "../../support/docs";
   import { acceptCookies, hu } from "../../support/site";

   test("Jelentkezés túrára", useCase("UC-TOUR-01"), async ({ page }) => {
     await page.goto("/");
     await acceptCookies(page);
     // … steps, asserting against hu.* texts, never literals
     await docScreenshot(page.locator("…"), "UC-TOUR-01-form");
   });
   ```

3. **Write the page** under `docs-site/src/content/docs/<area>/`:

   ```mdx
   ---
   title: Jelentkezés túrára
   usecases: [UC-TOUR-01]
   ---
   import TestCoverage from "../../../components/TestCoverage.astro";
   import Screenshot from "../../../components/Screenshot.astro";

   <TestCoverage id="UC-TOUR-01" />
   <Screenshot name="UC-TOUR-01-form" alt="…" />
   ```

4. If it is a new folder, add it to `sidebar` in `astro.config.mjs`.
5. Run `yarn e2e`, then `yarn docs:dev`, and check that the page shows the badge and the
   screenshot, and that `build-coverage.mjs` prints no "not tested" / "not documented"
   warning for the new ID.

Conventions:

- The guide is written for **site visitors, in Hungarian**: steps and what they will see,
  not implementation details.
- Screenshot names start with the use case ID (`UC-TOUR-01-…`).
- Prefer role-based locators (`getByRole`) scoped to a section of the page.
- Every run starts from a fresh copy, but the tests of one run share it and run in
  parallel. Use `uniqueEmail()` or similar for anything with a unique constraint.

---

## 9. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `'playwright' is not recognized…` | The e2e dependencies are not installed. Run `yarn setup:e2e`. |
| Submitting a form opens **Cookie beállítások** | The form was submitted before reCAPTCHA was ready. Use `acceptCookies()`, which waits for `body[data-recaptcha-ready]`. |
| The page shows **Szerver oldali hiba** and the Next log has `fetch failed … ECONNRESET` | Keep-alive race between Next and Strapi. `server/src/index.ts` raises Strapi's `keepAliveTimeout` to 65 s. Check that Strapi was restarted (`curl -sI localhost:1337/api/global` shows `Keep-Alive: timeout=65`). |
| Success and error message shown together | A server action spread `prevState` without clearing `successMessage`. Error branches must return `successMessage: null`. |
| Guide says "Képernyőkép hiányzik" / "Nincs teszt" | No test run on this machine yet, or `docs:dev` was started before it. Run `yarn e2e`, then `yarn docs:dev`. |
| Flaky first run after editing client code | The e2e client (`next dev` on `:3001`) is still compiling. Run the tests again. |
| `http://localhost:1338 is already used` / `:3001 …` | An e2e server from an aborted run is still alive. Stop that node process. |
| Registration fails with `Error sending confirmation email` | The run sends e-mails to Ethereal (`E2E_EMAIL_DELIVERY=ethereal`) and the network blocks outgoing SMTP. Run without it - the default keeps e-mails in the outbox. |
| `server/.tmp/e2e/` left on disk | The run was started without `run.mjs` (see above), or the process was killed. The next run replaces it, or delete it by hand. |

For the Next.js server-side error behind a failing page, check
`client/.next-e2e/dev/logs/next-development.log` (the e2e client's log). `fetchAPI` logs the failing URL and the real
network error (`cause`) there.
