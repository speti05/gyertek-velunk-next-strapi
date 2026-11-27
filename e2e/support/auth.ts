import { expect, type APIRequestContext, type Page } from "@playwright/test";
import { mailsMatching, type OutboxMail } from "./outbox";
import { STRAPI_URL } from "./servers";
import { hu, uniqueEmail } from "./site";

/** An account the tests create for themselves - the fixture databases hold no users. */
export type TestUser = { email: string; password: string };

/** A password that satisfies every rule of the policy (client/src/utils/password-policy.ts). */
export function strongPassword() {
  return `Tura!${Math.random().toString(36).slice(2, 8)}a`;
}

/** A fresh address and a valid password. Each address is unique, so is its Strapi username. */
export function newUser(prefix = "fiok"): TestUser {
  return { email: uniqueEmail(prefix), password: strongPassword() };
}

/** The register page (app/[locale]/register/RegisterForm.tsx). */
export function registerForm(page: Page) {
  const card = page.locator(".auth-page__card");
  const form = card.locator("form");
  return {
    card,
    email: form.getByLabel(hu.FORM_LABELS.email, { exact: true }),
    password: form.getByLabel(hu.AUTH_PASSWORD_LABEL, { exact: true }),
    passwordConfirmation: form.getByLabel(hu.AUTH_CONFIRM_PASSWORD_LABEL, { exact: true }),
    passwordRule: (label: string) => form.locator(".auth-page__password-rule", { hasText: label }),
    terms: form.getByRole("checkbox"),
    termsError: form.getByText(hu.AUTH_TERMS_REQUIRED_ERROR, { exact: true }),
    submit: form.getByRole("button", { name: hu.AUTH_REGISTER_LABEL, exact: true }),
    resendLink: form.getByRole("link", { name: hu.AUTH_RESEND_CONFIRMATION_LINK, exact: true }),
    alert: (text: string) => card.getByRole("alert").filter({ hasText: text }),
    backToLogin: card.getByRole("link", { name: hu.AUTH_BACK_TO_LOGIN, exact: true }),
  };
}

/** The login page (app/[locale]/profile/AuthForm.tsx). */
export function loginForm(page: Page) {
  const card = page.locator(".auth-page__card");
  const form = card.locator("form");
  return {
    card,
    email: form.getByLabel(hu.FORM_LABELS.email, { exact: true }),
    password: form.getByLabel(hu.AUTH_PASSWORD_LABEL, { exact: true }),
    submit: form.getByRole("button", { name: hu.AUTH_LOGIN_LABEL, exact: true }),
    registerLink: form.getByRole("link", { name: hu.AUTH_REGISTER_LABEL, exact: true }),
    forgotPasswordLink: form.getByRole("link", { name: hu.AUTH_FORGOT_PASSWORD_LABEL, exact: true }),
    alert: (text: string) => card.getByRole("alert").filter({ hasText: text }),
  };
}

/** The forgotten password page (app/[locale]/forgot-password/ForgotPasswordForm.tsx). */
export function forgotPasswordForm(page: Page) {
  const card = page.locator(".auth-page__card");
  const form = card.locator("form");
  return {
    card,
    email: form.getByLabel(hu.FORM_LABELS.email, { exact: true }),
    submit: form.getByRole("button", { name: hu.AUTH_FORGOT_PASSWORD_TITLE, exact: true }),
    alert: (text: string) => card.getByRole("alert").filter({ hasText: text }),
  };
}

/** The new password page the reset e-mail links to (app/[locale]/reset-password/ResetPasswordForm.tsx). */
export function resetPasswordForm(page: Page) {
  const card = page.locator(".auth-page__card");
  const form = card.locator("form");
  return {
    card,
    password: form.getByLabel(hu.AUTH_NEW_PASSWORD_LABEL, { exact: true }),
    passwordConfirmation: form.getByLabel(hu.AUTH_CONFIRM_PASSWORD_LABEL, { exact: true }),
    passwordRule: (label: string) => form.locator(".auth-page__password-rule", { hasText: label }),
    submit: form.getByRole("button", { name: hu.AUTH_SAVE_LABEL, exact: true }),
    alert: (text: string) => card.getByRole("alert").filter({ hasText: text }),
  };
}

/** The public paths of the auth pages (Hungarian, unprefixed - see client/src/i18n/config.ts). */
export const AUTH_PATHS = {
  login: "/bejelentkezes",
  register: "/regisztracio",
  profile: "/profil",
  confirmEmail: "/confirm-email",
  forgotPassword: "/elfelejtett-jelszo",
  resetPassword: "/reset-password",
} as const;

/** The n-th mail to `email` that carries the link `linkOf` looks for, in the order sent. */
async function waitForLinkMail(email: string, linkOf: (mail: OutboxMail) => string | null, nth: number, what: string) {
  let matching: OutboxMail[] = [];
  await expect
    .poll(
      async () => {
        matching = (await mailsMatching((mail) => mail.to.includes(email) && !!linkOf(mail)))
          .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        return matching.length;
      },
      { timeout: 30_000, message: `${what} e-mail #${nth} to ${email} never reached the outbox` }
    )
    .toBeGreaterThanOrEqual(nth);
  return matching[nth - 1];
}

/** The e-mail confirmation Strapi sends to `email` - the n-th one, when it was resent. */
export function waitForConfirmationMail(email: string, nth = 1) {
  return waitForLinkMail(email, confirmationLinkOf, nth, "confirmation");
}

/** The password reset mail Strapi sends to `email` - the n-th one, when it was requested again. */
export function waitForResetMail(email: string, nth = 1) {
  return waitForLinkMail(email, resetLinkOf, nth, "password reset");
}

/** The confirmation link of the mail: `<strapi>/api/auth/email-confirmation?confirmation=<code>`. */
export function confirmationLinkOf(mail: OutboxMail): string | null {
  const match = mail.html.match(/href="([^"]*\/api\/auth\/email-confirmation\?confirmation=[^"]+)"/);
  return match ? match[1].replace(/&amp;/g, "&") : null;
}

/** The reset link of the mail: `<client>/reset-password?code=<token>` (Strapi's email_reset_password). */
export function resetLinkOf(mail: OutboxMail): string | null {
  const match = mail.html.match(/href="([^"]*\/reset-password\?code=[^"]+)"/);
  return match ? match[1].replace(/&amp;/g, "&") : null;
}

/**
 * Registers an account straight through the Strapi API, the way the register form does
 * (client/src/data/auth-service.ts) - for the tests that need an account but are not about
 * registering. Returns once Strapi accepted it; the account is still unconfirmed.
 */
export async function createUnconfirmedUser(request: APIRequestContext, user = newUser()) {
  const response = await request.post(`${STRAPI_URL}/api/auth/local/register`, {
    data: { username: user.email.split("@")[0], email: user.email, password: user.password },
  });
  expect(response.ok(), await response.text()).toBe(true);
  return user;
}

/** An account that can log in: registered through the API and confirmed with the mailed link. */
export async function createConfirmedUser(request: APIRequestContext, user = newUser()) {
  await createUnconfirmedUser(request, user);
  const link = confirmationLinkOf(await waitForConfirmationMail(user.email))!;
  // Strapi confirms, then redirects to the client's /confirm-email page - not needed here
  const response = await request.get(link, { maxRedirects: 0 });
  expect(response.status(), "the confirmation link was rejected").toBe(302);
  expect(response.headers().location).not.toContain("error=");
  return user;
}

/** Fills in and submits the login form on the current page. */
export async function logIn(page: Page, { email, password }: TestUser) {
  const form = loginForm(page);
  await form.email.fill(email);
  await form.password.fill(password);
  await form.submit.click();
}
