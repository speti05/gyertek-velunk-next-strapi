import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

/**
 * Locally the tests reuse whatever `yarn dev` is already serving. In CI both apps are
 * built and started here, against the seeded SQLite database (see .github/workflows/docs.yml).
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
      command: isCI ? "yarn start" : "yarn develop",
      cwd: "../server",
      url: "http://localhost:1337/_health",
      reuseExistingServer: !isCI,
      timeout: 180_000,
    },
    {
      // Web servers start in order: the client build pre-renders pages from Strapi
      command: isCI ? "yarn build && yarn start" : "yarn dev",
      cwd: "../client",
      url: baseURL,
      reuseExistingServer: !isCI,
      timeout: 600_000,
    },
  ],
});
