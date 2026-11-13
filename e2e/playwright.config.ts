import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

// Next to, not instead of, a running `yarn dev` (1337 / 3000)
const STRAPI_PORT = 1338;
const CLIENT_PORT = 3001;
const strapiURL = `http://localhost:${STRAPI_PORT}`;
const baseURL = `http://localhost:${CLIENT_PORT}`;

/**
 * Both apps are started here, on their own ports, and Strapi runs on a copy of the
 * database (scripts/start-strapi.mjs) - the dev data is never written to. Run the suite
 * through `yarn test` / `yarn test:ui` (scripts/run.mjs), which deletes the copy afterwards.
 * In CI the copy is made from the seeded database (see .github/workflows/docs.yml).
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,
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
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
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
        // Development mode sends every e-mail to the Ethereal account in server/.env
        // (ETHEREAL_USER / ETHEREAL_PASS, see server/src/lib/email/ethereal.ts). Without it
        // the email plugin falls back to SMTP, which points at a closed port here.
        NODE_ENV: "development",
        SMTP_HOST: "127.0.0.1",
        SMTP_PORT: "2525",
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
