import { defineConfig, devices } from "@playwright/test";
import { CONSENT_STATE } from "./support/consent-state";
import { OUTBOX_DIR } from "./support/outbox";
import { CLIENT_PORT, CLIENT_URL, STRAPI_PORT, STRAPI_URL } from "./support/servers";

const isCI = !!process.env.CI;

const strapiURL = STRAPI_URL;
const baseURL = CLIENT_URL;

/**
 * Both apps are started here, on their own ports, and Strapi runs on a copy of the
 * database (scripts/start-strapi.mjs) - the dev data is never written to. Run the suite
 * through `yarn test` / `yarn test:ui` (scripts/run.mjs), which deletes the copy afterwards.
 * The copy is made from the committed e2e/fixtures/data.db (E2E_DB picks another one,
 * see scripts/e2e-db.mjs), locally and in CI alike.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: isCI,
  // Locally the client runs `yarn dev`, which compiles a page on its first request - often
  // more than 30 s on a cold start (e.g. a single test started from UI mode). CI serves a build.
  timeout: isCI ? 30_000 : 120_000,
  // The same goes for what a server action leads to: logging in redirects to /profil, which
  // the dev server compiles on that very request, and registering waits for Strapi to hash
  // the password and send the confirmation - well over the default 5 s while the parallel
  // workers keep the dev server busy.
  expect: { timeout: isCI ? 5_000 : 30_000 },
  retries: isCI ? 1 : 0,
  // Locally Playwright would start one worker per two cores (11 on a 22-core machine), all
  // against the one `next dev` server and Strapi - which then answer so slowly that every
  // test times out. A few workers finish sooner. Override with --workers.
  workers: isCI ? 2 : 3,
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    // Read by scripts/build-coverage.mjs to link use cases in the docs to their tests
    ["json", { outputFile: "test-results/results.json" }],
  ],
  use: {
    baseURL,
    locale: "hu-HU",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "desktop",
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], storageState: CONSENT_STATE },
    },
    {
      name: "mobile",
      dependencies: ["setup"],
      use: { ...devices["Pixel 7"], storageState: CONSENT_STATE },
    },
    // Accepts the cookie banner once and saves the state the other projects start from
    // (setup/cookie-consent.setup.ts) - it also warms up the client before the tests run.
    // Listed last: UI mode preselects the first project, which should be a real one -
    // the dependencies above make it run first all the same.
    { name: "setup", testDir: "./setup", testMatch: /.*\.setup\.ts/, use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: [
    {
      command: "node scripts/start-strapi.mjs",
      url: `${strapiURL}/_health`,
      reuseExistingServer: false,
      timeout: 180_000,
      env: {
        PORT: String(STRAPI_PORT),
        STRAPI_URL: strapiURL,
        CLIENT_URL: baseURL,
        // With E2E_EMAIL_DELIVERY=ethereal (see EMAIL_DELIVERY below), development mode sends
        // every e-mail to the Ethereal account in server/.env
        // (ETHEREAL_USER / ETHEREAL_PASS, see server/src/lib/email/ethereal.ts). Without it
        // the email plugin falls back to SMTP, which points at a closed port here.
        NODE_ENV: "development",
        SMTP_HOST: "127.0.0.1",
        SMTP_PORT: "2525",
        // A copy of every e-mail sent, for the tests to inspect (support/outbox.ts)
        EMAIL_OUTBOX_DIR: OUTBOX_DIR,
        // The mails are only saved to that outbox, nothing goes out (lib/email/outbox.ts) - the
        // tests need no network and no open SMTP port. E2E_EMAIL_DELIVERY=ethereal sends them
        // to Ethereal as well (as described above), which adds its preview link to the report.
        EMAIL_DELIVERY: process.env.E2E_EMAIL_DELIVERY === "ethereal" ? "" : "outbox",
        // Every auth request of the suite comes from the one Next.js server, i.e. one IP:
        // the per-IP limits on register / login (lib/auth/auth-overrides.ts) would trip
        AUTH_RATE_LIMIT_DISABLED: "true",
      },
    },
    {
      // Web servers start in order: the client build pre-renders pages from Strapi
      command: isCI ? `yarn build && yarn start -p ${CLIENT_PORT}` : `yarn dev -p ${CLIENT_PORT}`,
      cwd: "../client",
      url: baseURL,
      reuseExistingServer: false,
      timeout: 600_000,
      env: {
        // Its own build dir, so it does not clash with the `yarn dev` cache in .next/
        NEXT_DIST_DIR: ".next-e2e",
        STRAPI_API_URL: strapiURL,
        NEXT_PUBLIC_STRAPI_URL: strapiURL,
        NEXT_PUBLIC_SITE_URL: baseURL,
      },
    },
  ],
});
