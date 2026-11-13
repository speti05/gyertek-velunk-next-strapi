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
| `.github/workflows/docs.yml` | CI: runs the tests on a freshly seeded Strapi, builds the guide and publishes it to GitHub Pages. |
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
- **`webServer`:** Playwright makes sure Strapi (`:1337/_health`) and then the client
  (`:3000`) are up before the tests start.
  - **Locally** (`reuseExistingServer`) it uses the `yarn dev` you already have running. If
    nothing is running, it starts `yarn develop` / `yarn dev` itself, which can take a few
    minutes the first time.
  - **In CI** it starts a built Strapi and runs `yarn build && yarn start` for the client.
    The order matters: the client build pre-renders pages from Strapi content.
- `E2E_BASE_URL` overrides the client URL (default `http://localhost:3000`).

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

Day to day, with `yarn dev` running:

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
2. Writes a throwaway `server/.env` with random secrets. SMTP points at a closed port, so
   signup e-mails fail in the background and are only logged.
3. Seeds the database from `seed-data.tar.gz` (`yarn seed`) and builds Strapi.
4. Installs Chromium and runs `yarn test`. Playwright starts Strapi, then builds and starts
   the client.
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
- Tests must be safe to rerun against the same database. Use `uniqueEmail()` or similar
  for anything with a unique constraint.

---

## 9. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `'playwright' is not recognized…` | The e2e dependencies are not installed. Run `yarn setup:e2e`. |
| Submitting a form opens **Cookie beállítások** | The form was submitted before reCAPTCHA was ready. Use `acceptCookies()`, which waits for `body[data-recaptcha-ready]`. |
| The page shows **Szerver oldali hiba** and the Next log has `fetch failed … ECONNRESET` | Keep-alive race between Next and Strapi. `server/src/index.ts` raises Strapi's `keepAliveTimeout` to 65 s. Check that Strapi was restarted (`curl -sI localhost:1337/api/global` shows `Keep-Alive: timeout=65`). |
| Success and error message shown together | A server action spread `prevState` without clearing `successMessage`. Error branches must return `successMessage: null`. |
| Guide says "Képernyőkép hiányzik" / "Nincs teszt" | No test run on this machine yet, or `docs:dev` was started before it. Run `yarn e2e`, then `yarn docs:dev`. |
| Flaky first run after editing client code | The Next dev server is still compiling. Run the tests again once it has settled. |

For the Next.js server-side error behind a failing page, check
`client/.next/dev/logs/next-development.log`. `fetchAPI` logs the failing URL and the real
network error (`cause`) there.
