import { test as setup } from "@playwright/test";
import { CONSENT_STATE } from "../support/consent-state";
import { acceptCookies } from "../support/site";

/**
 * Runs once before every test (the `setup` project in playwright.config.ts): accepts the
 * cookie banner on the UI and saves the browser state, which the desktop and mobile
 * projects start from - so every test opens the site with consent given and reCAPTCHA on.
 *
 * It is also the first request to the client. `yarn dev` compiles the home page on that
 * request, which can take well over a test's 30 s, hence the long timeouts here - the
 * tests then hit an already compiled page instead of all compiling it at once.
 */
setup("Sütik elfogadása", async ({ page }) => {
  setup.setTimeout(300_000);

  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 240_000 });
  await acceptCookies(page);

  await page.context().storageState({ path: CONSENT_STATE });
});
