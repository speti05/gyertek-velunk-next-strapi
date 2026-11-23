import type { Page } from "@playwright/test";
import { getTexts } from "@client/i18n/texts";

/** The Hungarian texts the site renders - assertions read from here, never from literals. */
export const hu = getTexts("hu");

/**
 * Accepts every category on the cookie banner, which also enables reCAPTCHA. The tests do
 * not call this: the `setup` project does it once and they start from its saved state.
 */
export async function acceptCookies(page: Page) {
  // Our own banner (CookieConsentBanner.tsx) - vanilla-cookieconsent's #cc-main runs with autoShow: false
  const banner = page.locator(".cookie-banner");
  await banner.getByRole("button", { name: hu.COOKIE_BANNER_ACCEPT_ALL, exact: true }).click();
  await banner.waitFor({ state: "hidden" });
  await waitForRecaptcha(page);
}

/**
 * reCAPTCHA only loads after consent, and a form submitted before it is ready reopens the
 * cookie preferences instead (use-recaptcha-submit.ts). The flag is set by recaptcha-provider.tsx,
 * right away when no site key is configured (as in CI) - the forms then submit without a token.
 */
export async function waitForRecaptcha(page: Page) {
  await page.locator("body[data-recaptcha-ready]").waitFor({ state: "attached", timeout: 60_000 });
}

/**
 * Opens a page of the site, ready for the forms to be used. It waits for the DOM rather than
 * the `load` event: on the dev server `load` can take long (images, fonts, lazy chunks), and
 * what the tests need is hydration - signalled by the reCAPTCHA flag (cookies are accepted by
 * the setup project).
 */
export async function openPage(page: Page, url: string) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await waitForRecaptcha(page);
}

/** A unique, undeliverable address so reruns never hit the unique-email constraint. */
export function uniqueEmail(prefix = "e2e") {
  return `${prefix}+${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}
