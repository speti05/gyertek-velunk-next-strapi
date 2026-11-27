import { test as setup, type APIRequestContext } from "@playwright/test";
import { CONSENT_STATE } from "../support/consent-state";
import { acceptCookies } from "../support/site";

/** A JWT that is not expired, so the route guard lets /profil render (Strapi then rejects it). */
function unexpiredJwt() {
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const exp = Math.floor(Date.now() / 1000) + 60 * 60;
  return `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ id: 0, exp })}.bemelegites`;
}

/**
 * Has the dev server compile the routes the auth tests go through - the login, register and
 * password reset pages, the e-mail confirmation page and the profile (plus the session-expired route it
 * falls back to with a token Strapi rejects). Compiled on first request, while the parallel
 * workers already run, they take long enough to fail the tests and can overload the dev server.
 */
async function warmUpAuthRoutes(request: APIRequestContext) {
  const routes: [string, Record<string, string>?][] = [
    ["/bejelentkezes"],
    ["/regisztracio"],
    ["/confirm-email"],
    ["/elfelejtett-jelszo"],
    ["/reset-password?code=bemelegites"],
    ["/profil", { cookie: `jwt=${unexpiredJwt()}` }],
  ];
  // One after the other: compiling several routes at once had the dev server write
  // .next-e2e/dev/prerender-manifest.json concurrently and leave it corrupt (every page 500)
  for (const [url, headers] of routes) {
    await request.get(url, { headers, timeout: 240_000, failOnStatusCode: false });
  }
}

/**
 * Runs once before every test (the `setup` project in playwright.config.ts): accepts the
 * cookie banner on the UI and saves the browser state, which the desktop and mobile
 * projects start from - so every test opens the site with consent given and reCAPTCHA on.
 *
 * It is also the first request to the client. `yarn dev` compiles a page on its first
 * request, which can take well over a test's 30 s, hence the long timeouts here - the
 * tests then hit already compiled pages instead of all compiling them at once.
 */
setup("Sütik elfogadása", async ({ page }) => {
  setup.setTimeout(300_000);

  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 240_000 });
  await acceptCookies(page);

  await page.context().storageState({ path: CONSENT_STATE });

  await warmUpAuthRoutes(page.request);
});
