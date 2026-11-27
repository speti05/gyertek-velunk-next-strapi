import { expect, test } from "@playwright/test";
import {
  AUTH_PATHS,
  createConfirmedUser,
  createUnconfirmedUser,
  logIn,
  loginForm,
  newUser,
} from "../../support/auth";
import { docScreenshot, useCase } from "../../support/docs";
import { CLIENT_URL } from "../../support/servers";
import { hu, openPage } from "../../support/site";

// Docs: docs-site/src/content/docs/fiok/bejelentkezes.mdx

const onPath = (path: string) => new RegExp(`${path.replace(/[?]/g, "\\?")}$`);

/** A JWT that expired long ago - its signature is never checked before the expiry (auth-guard.ts). */
function expiredJwt() {
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ id: 1, exp: 1_000_000_000 })}.lejart`;
}

test.describe("Bejelentkezés", () => {
  test("Sikeres bejelentkezés és kijelentkezés", useCase("UC-LOGIN-01"), async ({ page, request }) => {
    const user = await createConfirmedUser(request, newUser("belepes"));
    await openPage(page, AUTH_PATHS.login);
    const form = loginForm(page);

    await form.email.fill(user.email);
    await form.password.fill(user.password);
    await docScreenshot(form.card, "UC-LOGIN-01-form");
    await form.submit.click();

    // Logging in leads to the profile page
    await expect(page).toHaveURL(onPath(AUTH_PATHS.profile));
    await expect(page.locator(".profile-identity__email")).toHaveText(user.email);
    await docScreenshot(page, "UC-LOGIN-01-profile");

    // While logged in, the login page sends the visitor straight on to the profile
    await openPage(page, AUTH_PATHS.login);
    await expect(page).toHaveURL(onPath(AUTH_PATHS.profile));

    // Logging out leads back to the login page, and the profile is closed again
    await page.locator("main").getByRole("button", { name: hu.AUTH_LOGOUT_LABEL, exact: true }).click();
    await expect(page).toHaveURL(onPath(AUTH_PATHS.login));
    await expect(form.submit).toBeVisible();

    await openPage(page, AUTH_PATHS.profile);
    await expect(page).toHaveURL(onPath(AUTH_PATHS.login));
  });

  test("Hibás e-mail cím vagy jelszó", useCase("UC-LOGIN-02"), async ({ page, request }) => {
    const user = await createConfirmedUser(request, newUser("hibas-jelszo"));
    await openPage(page, AUTH_PATHS.login);
    const form = loginForm(page);

    // A wrong password
    await logIn(page, { ...user, password: `${user.password}x` });
    await expect(form.alert(hu.MESSAGES.loginFailed)).toBeVisible();
    await expect(page).toHaveURL(onPath(AUTH_PATHS.login));
    await docScreenshot(form.card, "UC-LOGIN-02-failed");

    // An address with no account gets the very same answer - it does not tell which one was wrong
    // (from a fresh page, so the message cannot be left over from the first attempt)
    await openPage(page, AUTH_PATHS.login);
    await logIn(page, { ...newUser("ismeretlen"), password: user.password });
    await expect(form.alert(hu.MESSAGES.loginFailed)).toBeVisible();
    await expect(page).toHaveURL(onPath(AUTH_PATHS.login));

    // Input that cannot be right is caught before it reaches the server
    await logIn(page, { email: "teszt@pelda", password: "rov" });
    await expect(form.email).toHaveAccessibleDescription(hu.MESSAGES.emailInvalid);
    await expect(form.password).toHaveAccessibleDescription(hu.MESSAGES.invalidPassword);
    await docScreenshot(form.card, "UC-LOGIN-02-invalid");
  });

  test("Bejelentkezés az e-mail cím megerősítése előtt", useCase("UC-LOGIN-03"), async ({ page, request }) => {
    const user = await createUnconfirmedUser(request, newUser("nincs-megerositve"));
    await openPage(page, AUTH_PATHS.login);
    const form = loginForm(page);

    await logIn(page, user);

    await expect(form.alert(hu.MESSAGES.loginFailed)).toBeVisible();
    await expect(page).toHaveURL(onPath(AUTH_PATHS.login));
  });

  test("Profil megnyitása bejelentkezés nélkül vagy lejárt munkamenettel", useCase("UC-LOGIN-04"), async ({ page, request }) => {
    // Not logged in: the profile sends the visitor to the login page, without a notice
    await openPage(page, AUTH_PATHS.profile);
    await expect(page).toHaveURL(onPath(AUTH_PATHS.login));
    const form = loginForm(page);
    await expect(form.alert(hu.MESSAGES.sessionExpired)).toHaveCount(0);

    // An expired login: the same, with a notice explaining why
    await page.context().addCookies([{ name: "jwt", value: expiredJwt(), url: CLIENT_URL }]);
    await openPage(page, AUTH_PATHS.profile);
    await expect(page).toHaveURL(onPath(`${AUTH_PATHS.login}?session=expired`));
    await expect(form.card.getByRole("alert")).toHaveText(hu.MESSAGES.sessionExpired);
    await docScreenshot(form.card, "UC-LOGIN-04-expired");

    // Logging in again leads back to the profile
    const user = await createConfirmedUser(request, newUser("lejart"));
    await logIn(page, user);
    await expect(page).toHaveURL(onPath(AUTH_PATHS.profile));
  });
});
