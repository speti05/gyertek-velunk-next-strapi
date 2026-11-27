import { expect, test, type Page } from "@playwright/test";
import { getStrapiTexts } from "@server/i18n/get-strapi-texts";
import {
  AUTH_PATHS,
  confirmationLinkOf,
  createConfirmedUser,
  createUnconfirmedUser,
  logIn,
  newUser,
  registerForm,
  waitForConfirmationMail,
  type TestUser,
} from "../../support/auth";
import { docScreenshot, useCase } from "../../support/docs";
import type { OutboxMail } from "../../support/outbox";
import { STRAPI_URL } from "../../support/servers";
import { hu, openPage } from "../../support/site";

// Docs: docs-site/src/content/docs/fiok/regisztracio.mdx

/** The e-mail texts the server sends - assertions read from here, never from literals. */
const mailTexts = getStrapiTexts("hu");

/** Fills in every field of the register form; the terms checkbox is left to the test. */
async function fillRegisterForm(page: Page, { email, password }: TestUser, confirmation = password) {
  const form = registerForm(page);
  await form.email.fill(email);
  await form.password.fill(password);
  await form.passwordConfirmation.fill(confirmation);
  return form;
}

/** Renders a sent e-mail in its own tab, the way a mail client shows it. */
async function openMail(page: Page, mail: OutboxMail) {
  const mailPage = await page.context().newPage();
  await mailPage.setContent(mail.html, { waitUntil: "load" });
  if (mail.previewUrl) test.info().annotations.push({ type: "Ethereal", description: mail.previewUrl });
  return mailPage;
}

test.describe("Regisztráció", () => {
  test.beforeEach(async ({ page }) => {
    await openPage(page, AUTH_PATHS.register);
  });

  test("Sikeres regisztráció és az e-mail cím megerősítése", useCase("UC-REG-01"), async ({ page }) => {
    const user = newUser("regisztracio");
    const form = await fillRegisterForm(page, user);

    // The live checklist ticks every rule of the password policy
    for (const rule of hu.PASSWORD_RULES) {
      await expect(form.passwordRule(rule.label)).toHaveClass(/auth-page__password-rule--met/);
    }
    await form.terms.check();
    await docScreenshot(form.card, "UC-REG-01-form");

    await form.submit.click();

    await expect(form.alert(hu.MESSAGES.registrationEmailSent)).toBeVisible();
    await expect(form.backToLogin).toBeVisible();
    await docScreenshot(form.card, "UC-REG-01-success");

    // The confirmation e-mail carries the link to confirm the address with
    const mail = await waitForConfirmationMail(user.email);
    const mailPage = await openMail(page, mail);
    const confirmButton = mailPage.getByRole("link", { name: mailTexts.EMAIL_CONFIRMATION_BUTTON_LABEL }).first();
    await expect(confirmButton).toHaveAttribute("href", confirmationLinkOf(mail)!);
    await docScreenshot(mailPage.locator("body"), "UC-REG-01-email");

    // Strapi confirms the address and sends the visitor on to the site
    await confirmButton.click();
    await expect(mailPage).toHaveURL(new RegExp(`${AUTH_PATHS.confirmEmail}$`));
    await expect(mailPage.getByRole("heading", { name: hu.AUTH_CONFIRM_EMAIL_TITLE })).toBeVisible();
    await expect(mailPage.getByText(hu.MESSAGES.confirmEmailSuccess)).toBeVisible();
    await docScreenshot(mailPage.locator(".auth-page__card"), "UC-REG-01-confirmed");
    await mailPage.close();

    // ...after which the new account can log in, and is subscribed to the newsletter
    await openPage(page, AUTH_PATHS.login);
    await logIn(page, user);
    await expect(page).toHaveURL(new RegExp(`${AUTH_PATHS.profile}$`));
    await expect(page.locator(".profile-identity__email")).toHaveText(user.email);
    await expect(page.getByLabel(hu.PROFILE_NEWSLETTER_SUBSCRIBE_LABEL)).toBeChecked();
  });

  test("Hiányzó vagy hibás adatok", useCase("UC-REG-02"), async ({ page }) => {
    const form = registerForm(page);

    // The terms have to be accepted - the form is not sent without it
    await fillRegisterForm(page, newUser());
    await form.submit.click();
    await expect(form.termsError).toBeVisible();
    await expect(form.alert(hu.MESSAGES.registrationEmailSent)).toHaveCount(0);
    await docScreenshot(form.card, "UC-REG-02-terms");

    // Accepting them clears the error
    await form.terms.check();
    await expect(form.termsError).toHaveCount(0);

    // A weak password: the checklist shows which rules are still missing
    await fillRegisterForm(page, { email: "teszt@pelda", password: "jelszo" });
    const [lengthRule, mixedCaseRule, specialRule] = hu.PASSWORD_RULES;
    await expect(form.passwordRule(lengthRule.label)).toHaveClass(/auth-page__password-rule--met/);
    await expect(form.passwordRule(mixedCaseRule.label)).not.toHaveClass(/auth-page__password-rule--met/);
    await expect(form.passwordRule(specialRule.label)).not.toHaveClass(/auth-page__password-rule--met/);

    // ...and sending it anyway names the problem under each field
    await form.submit.click();
    await expect(form.email).toHaveAccessibleDescription(hu.MESSAGES.emailInvalid);
    await expect(form.password).toHaveAccessibleDescription(hu.MESSAGES.passwordNeedsUppercase);
    await docScreenshot(form.card, "UC-REG-02-invalid");

    // The two passwords have to match
    const user = newUser();
    await fillRegisterForm(page, user, `${user.password}x`);
    await form.submit.click();
    await expect(form.passwordConfirmation).toHaveAccessibleDescription(hu.MESSAGES.passwordMismatch);
    await expect(form.email).not.toHaveAccessibleDescription(hu.MESSAGES.emailInvalid);
    await expect(form.alert(hu.MESSAGES.registrationEmailSent)).toHaveCount(0);
    await docScreenshot(form.card, "UC-REG-02-mismatch");
  });

  test("Már regisztrált, de még meg nem erősített e-mail cím", useCase("UC-REG-03"), async ({ page, request }) => {
    const user = await createUnconfirmedUser(request, newUser("megerositetlen"));
    await waitForConfirmationMail(user.email);

    const form = await fillRegisterForm(page, user);
    await form.terms.check();
    await form.submit.click();

    await expect(form.alert(hu.MESSAGES.emailNotConfirmed)).toBeVisible();
    await expect(form.resendLink).toBeVisible();
    await docScreenshot(form.card, "UC-REG-03-not-confirmed");

    // A new confirmation e-mail can be requested right from the message
    await form.resendLink.click();
    await expect(form.alert(hu.MESSAGES.confirmationEmailResent)).toBeVisible();
    await expect(form.resendLink).toHaveCount(0);
    await docScreenshot(form.card, "UC-REG-03-resent");

    const resent = await waitForConfirmationMail(user.email, 2);
    expect(confirmationLinkOf(resent)).toBeTruthy();
  });

  test("Már regisztrált e-mail cím", useCase("UC-REG-04"), async ({ page, request }) => {
    const user = await createConfirmedUser(request, newUser("foglalt"));

    const form = await fillRegisterForm(page, { ...user, password: "Masik!jelszo1" });
    await form.terms.check();
    await form.submit.click();

    await expect(form.alert(hu.MESSAGES.emailAlreadyTaken)).toBeVisible();
    await expect(form.resendLink).toHaveCount(0);
    await docScreenshot(form.card, "UC-REG-04-taken");
  });

  test("Érvénytelen vagy már felhasznált megerősítő link", useCase("UC-REG-05"), async ({ page }) => {
    // The link is opened on Strapi, which sends the visitor back to the site with the outcome
    await page.goto(`${STRAPI_URL}/api/auth/email-confirmation?confirmation=ervenytelen-kod`);

    await expect(page).toHaveURL(new RegExp(`${AUTH_PATHS.confirmEmail}\\?error=invalid$`));
    await expect(page.getByText(hu.MESSAGES.confirmEmailFailed)).toBeVisible();
    await docScreenshot(page.locator(".auth-page__card"), "UC-REG-05-invalid-link");
  });
});
