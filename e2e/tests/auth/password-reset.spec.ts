import { expect, test, type Page } from "@playwright/test";
import { getStrapiTexts } from "@server/i18n/get-strapi-texts";
import {
  AUTH_PATHS,
  createConfirmedUser,
  createUnconfirmedUser,
  forgotPasswordForm,
  logIn,
  loginForm,
  newUser,
  resetLinkOf,
  resetPasswordForm,
  strongPassword,
  waitForResetMail,
} from "../../support/auth";
import { docScreenshot, useCase } from "../../support/docs";
import { mailsMatching, type OutboxMail } from "../../support/outbox";
import { hu, openPage, waitForRecaptcha } from "../../support/site";

// Docs: docs-site/src/content/docs/fiok/elfelejtett-jelszo.mdx

/** The e-mail texts the server sends - assertions read from here, never from literals. */
const mailTexts = getStrapiTexts("hu");

const onPath = (path: string) => new RegExp(`${path.replace(/[?]/g, "\\?")}$`);

/** Renders a sent e-mail in its own tab, the way a mail client shows it. */
async function openMail(page: Page, mail: OutboxMail) {
  const mailPage = await page.context().newPage();
  await mailPage.setContent(mail.html, { waitUntil: "load" });
  if (mail.previewUrl) test.info().annotations.push({ type: "Ethereal", description: mail.previewUrl });
  return mailPage;
}

/** Requests the reset e-mail for `email` on the forgotten password page. */
async function requestReset(page: Page, email: string) {
  await openPage(page, AUTH_PATHS.forgotPassword);
  const form = forgotPasswordForm(page);
  await form.email.fill(email);
  await form.submit.click();
  await expect(form.alert(hu.AUTH_FORGOT_PASSWORD_SUCCESS)).toBeVisible();
  return form;
}

/** Sets `password` on the reset page that is open in `page`. */
async function setNewPassword(page: Page, password: string, confirmation = password) {
  const form = resetPasswordForm(page);
  await form.password.fill(password);
  await form.passwordConfirmation.fill(confirmation);
  await form.submit.click();
  return form;
}

test.describe("Elfelejtett jelszó", () => {
  test("Új jelszó beállítása e-mailben kapott linkkel", useCase("UC-PWD-01"), async ({ page, request }) => {
    const user = await createConfirmedUser(request, newUser("jelszocsere"));
    const newPassword = strongPassword();

    // The forgotten password page opens from the login page
    await openPage(page, AUTH_PATHS.login);
    await loginForm(page).forgotPasswordLink.click();
    await expect(page).toHaveURL(onPath(AUTH_PATHS.forgotPassword));
    await waitForRecaptcha(page);

    const form = forgotPasswordForm(page);
    await form.email.fill(user.email);
    await docScreenshot(form.card, "UC-PWD-01-request");
    await form.submit.click();

    await expect(form.alert(hu.AUTH_FORGOT_PASSWORD_SUCCESS)).toBeVisible();
    await docScreenshot(form.card, "UC-PWD-01-requested");

    // The e-mail links to the page where the new password is set
    const mail = await waitForResetMail(user.email);
    const mailPage = await openMail(page, mail);
    const resetButton = mailPage.getByRole("link", { name: mailTexts.RESET_PASSWORD_BUTTON_LABEL }).first();
    await expect(resetButton).toHaveAttribute("href", resetLinkOf(mail)!);
    await docScreenshot(mailPage.locator("body"), "UC-PWD-01-email");

    await resetButton.click();
    await expect(mailPage).toHaveURL(/\/reset-password\?code=/);
    await waitForRecaptcha(mailPage);
    const reset = resetPasswordForm(mailPage);
    await reset.password.fill(newPassword);
    await reset.passwordConfirmation.fill(newPassword);
    for (const rule of hu.PASSWORD_RULES) {
      await expect(reset.passwordRule(rule.label)).toHaveClass(/auth-page__password-rule--met/);
    }
    await docScreenshot(reset.card, "UC-PWD-01-new-password");

    // Saving it leads to the login page
    await reset.submit.click();
    await expect(mailPage).toHaveURL(onPath(AUTH_PATHS.login));

    // The old password no longer works...
    await logIn(mailPage, user);
    await expect(loginForm(mailPage).alert(hu.MESSAGES.loginFailed)).toBeVisible();

    // ...the new one does
    await openPage(mailPage, AUTH_PATHS.login);
    await logIn(mailPage, { ...user, password: newPassword });
    await expect(mailPage).toHaveURL(onPath(AUTH_PATHS.profile));
    await mailPage.close();

    // The link works once only
    await page.goto(resetLinkOf(mail)!, { waitUntil: "domcontentloaded" });
    await waitForRecaptcha(page);
    await setNewPassword(page, strongPassword());
    await expect(resetPasswordForm(page).alert(hu.MESSAGES.tryAgain)).toBeVisible();
  });

  test("Ismeretlen e-mail cím", useCase("UC-PWD-02"), async ({ page }) => {
    const email = newUser("ismeretlen").email;

    // The answer is the same as for a registered address - it does not reveal which addresses have an account
    const form = await requestReset(page, email);
    await docScreenshot(form.card, "UC-PWD-02-unknown");

    // ...but no e-mail goes out
    await page.waitForTimeout(2_000);
    expect(await mailsMatching((mail) => mail.to.includes(email))).toEqual([]);
  });

  test("Hiányzó vagy hibás adatok", useCase("UC-PWD-03"), async ({ page }) => {
    // An address the browser accepts but which has no domain ending
    await openPage(page, AUTH_PATHS.forgotPassword);
    const form = forgotPasswordForm(page);
    await form.email.fill("teszt@pelda");
    await form.submit.click();
    await expect(form.email).toHaveAccessibleDescription(hu.MESSAGES.emailInvalid);
    await expect(form.alert(hu.AUTH_FORGOT_PASSWORD_SUCCESS)).toHaveCount(0);
    await docScreenshot(form.card, "UC-PWD-03-invalid-email");

    // The new password has to satisfy the same rules as at registration - checked before
    // the link's code is used, so any code will do here
    await openPage(page, `${AUTH_PATHS.resetPassword}?code=barmilyen-kod`);
    const reset = await setNewPassword(page, "jelszo!");
    await expect(reset.password).toHaveAccessibleDescription(hu.MESSAGES.passwordNeedsUppercase);
    await docScreenshot(reset.card, "UC-PWD-03-weak-password");

    const password = strongPassword();
    await setNewPassword(page, password, `${password}x`);
    await expect(reset.passwordConfirmation).toHaveAccessibleDescription(hu.MESSAGES.passwordMismatch);
    await expect(page).toHaveURL(/\/reset-password\?code=/);
  });

  test("Érvénytelen jelszó-visszaállító link", useCase("UC-PWD-04"), async ({ page }) => {
    // A link without its code
    await openPage(page, AUTH_PATHS.resetPassword);
    await expect(page.getByText(hu.AUTH_INVALID_RESET_LINK, { exact: true })).toBeVisible();
    await expect(resetPasswordForm(page).submit).toHaveCount(0);
    await docScreenshot(page.locator(".auth-page__card"), "UC-PWD-04-no-code");

    // A code Strapi does not know (mistyped, or already used)
    await openPage(page, `${AUTH_PATHS.resetPassword}?code=ervenytelen-kod`);
    const reset = await setNewPassword(page, strongPassword());
    await expect(reset.alert(hu.MESSAGES.tryAgain)).toBeVisible();
    await expect(page).toHaveURL(/\/reset-password\?code=/);
    await docScreenshot(reset.card, "UC-PWD-04-invalid-code");
  });

  test("Jelszócsere még meg nem erősített fióknál", useCase("UC-PWD-05"), async ({ page, request }) => {
    const user = await createUnconfirmedUser(request, newUser("csere-megerositetlen"));
    const newPassword = strongPassword();

    await requestReset(page, user.email);
    const link = resetLinkOf(await waitForResetMail(user.email))!;

    await page.goto(link, { waitUntil: "domcontentloaded" });
    await waitForRecaptcha(page);
    await setNewPassword(page, newPassword);
    await expect(page).toHaveURL(onPath(AUTH_PATHS.login));

    // The reset e-mail proved the address, so the account is confirmed and can log in
    await logIn(page, { ...user, password: newPassword });
    await expect(page).toHaveURL(onPath(AUTH_PATHS.profile));
  });
});
