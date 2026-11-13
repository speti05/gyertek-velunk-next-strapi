import type { Page } from "@playwright/test";
import { getTexts } from "@client/i18n/texts";

/** The Hungarian texts the site renders - assertions read from here, never from literals. */
export const hu = getTexts("hu");

/** Accepts every category on the cookie banner, which also enables reCAPTCHA. */
export async function acceptCookies(page: Page) {
  // Our own banner (CookieConsentBanner.tsx) - vanilla-cookieconsent's #cc-main runs with autoShow: false
  const banner = page.locator(".cookie-banner");
  await banner.getByRole("button", { name: hu.COOKIE_BANNER_ACCEPT_ALL, exact: true }).click();
  await banner.waitFor({ state: "hidden" });
  await waitForRecaptcha(page);
}

/**
 * reCAPTCHA only loads after consent, and a form submitted before it is ready reopens the
 * cookie preferences instead (use-recaptcha-submit.ts). The flag is set by recaptcha-provider.tsx.
 */
async function waitForRecaptcha(page: Page) {
  await page.locator("body[data-recaptcha-ready]").waitFor({ state: "attached", timeout: 15_000 });
}

/** A unique, undeliverable address so reruns never hit the unique-email constraint. */
export function uniqueEmail(prefix = "e2e") {
  return `${prefix}+${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}
