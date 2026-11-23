import { expect, test, type Page } from "@playwright/test";
import { getStrapiTexts } from "@server/i18n/get-strapi-texts";
import { docScreenshot, useCase } from "../../support/docs";
import { mailsMatching, waitForMail, type OutboxMail } from "../../support/outbox";
import { hu, openPage, uniqueEmail } from "../../support/site";

// Docs: docs-site/src/content/docs/kapcsolat/kapcsolatfelvetel.mdx

/** The e-mail texts the server sends - assertions read from here, never from literals. */
const mailTexts = getStrapiTexts("hu");

/** The contact request block on the home page (ContactRequestForm.tsx). */
function contactBlock(page: Page) {
  const section = page.locator("section#contact-request");
  return {
    section,
    name: section.getByLabel(hu.CONTACT_REQUEST_NAME_LABEL),
    phone: section.getByLabel(hu.CONTACT_REQUEST_PHONE_LABEL),
    email: section.getByLabel(hu.CONTACT_REQUEST_EMAIL_LABEL),
    // The radio inputs are hidden behind their styled labels, so the labels are clicked
    option: (label: string) => section.getByRole("radiogroup").getByText(label, { exact: true }),
    radio: (label: string) => section.getByRole("radio", { name: label, exact: true }),
    submit: section.getByRole("button", { name: hu.CONTACT_REQUEST_SUBMIT_LABEL, exact: true }),
    newRequest: section.getByRole("button", { name: hu.CONTACT_REQUEST_NEW_REQUEST_LABEL, exact: true }),
    alert: section.getByRole("alert"),
  };
}

/** A unique name, so the e-mails of this test can be told apart from the rest of the run. */
function uniqueName() {
  return `Teszt Elek ${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** A unique phone number - the server rejects the same one twice within 24 hours. */
function uniquePhone() {
  const digits = String(Math.floor(Math.random() * 1e7)).padStart(7, "0");
  return `+36 30 ${digits.slice(0, 3)} ${digits.slice(3)}`;
}

/** Renders a sent e-mail in its own tab, the way a mail client shows it. */
async function openMail(page: Page, mail: OutboxMail) {
  const mailPage = await page.context().newPage();
  await mailPage.setContent(mail.html, { waitUntil: "load" });
  if (mail.previewUrl) test.info().annotations.push({ type: "Ethereal", description: mail.previewUrl });
  return mailPage;
}

const isAdminMailFor = (name: string) => (mail: OutboxMail) =>
  mail.subject === mailTexts.CONTACT_REQUEST_ADMIN_MAIL_SUBJECT && mail.html.includes(name);

test.describe("Kapcsolatfelvétel", () => {
  test.beforeEach(async ({ page }) => {
    await openPage(page, "/");
    await contactBlock(page).section.scrollIntoViewIfNeeded();
  });

  test("Visszahívás kérése telefonon", useCase("UC-CONTACT-01"), async ({ page }) => {
    const block = contactBlock(page);
    const name = uniqueName();
    const phone = uniquePhone();

    // Phone is the default choice
    await expect(block.radio(hu.CONTACT_REQUEST_PHONE_OPTION)).toBeChecked();
    await expect(block.email).toHaveCount(0);
    await block.name.fill(name);
    await block.phone.fill(phone);
    await docScreenshot(block.section, "UC-CONTACT-01-form");

    await block.submit.click();

    await expect(block.alert).toHaveText(hu.MESSAGES.contactRequestSuccess);
    await docScreenshot(block.section, "UC-CONTACT-01-success");

    // The organisers are notified with the phone number to call back
    const adminMail = await waitForMail(isAdminMailFor(name));
    const mailPage = await openMail(page, adminMail);
    await expect(mailPage.getByText(mailTexts.CONTACT_REQUEST_ADMIN_TITLE)).toBeVisible();
    await expect(mailPage.getByText(name, { exact: true })).toBeVisible();
    await expect(mailPage.getByText(phone, { exact: true })).toBeVisible();
    await expect(mailPage.getByText(mailTexts.CONTACT_PREFERENCE_PHONE_LABEL, { exact: true })).toBeVisible();
    await docScreenshot(mailPage.locator("body"), "UC-CONTACT-01-admin-email");
    await mailPage.close();

    // No e-mail address was given, so no confirmation goes out - only the admin mail mentions the name
    const mailsForName = await mailsMatching((mail) => mail.html.includes(name));
    expect(mailsForName.map((mail) => mail.subject)).toEqual([mailTexts.CONTACT_REQUEST_ADMIN_MAIL_SUBJECT]);

    // A new request can be started right away, from an empty form
    await block.newRequest.click();
    await expect(block.name).toHaveValue("");
    await expect(block.radio(hu.CONTACT_REQUEST_PHONE_OPTION)).toBeChecked();
  });

  test("Kapcsolatfelvétel kérése e-mailben, visszaigazoló levéllel", useCase("UC-CONTACT-02"), async ({ page }) => {
    const block = contactBlock(page);
    const name = uniqueName();
    const email = uniqueEmail("kapcsolat");

    await block.option(hu.CONTACT_REQUEST_EMAIL_OPTION).click();
    await expect(block.radio(hu.CONTACT_REQUEST_EMAIL_OPTION)).toBeChecked();
    await expect(block.phone).toHaveCount(0);
    await block.name.fill(name);
    await block.email.fill(email);
    await docScreenshot(block.section, "UC-CONTACT-02-form");

    await block.submit.click();

    await expect(block.alert).toHaveText(hu.MESSAGES.contactRequestSuccess);

    // The requester gets a confirmation at the address they gave
    const confirmation = await waitForMail((mail) => mail.to.includes(email));
    expect(confirmation.subject).toBe(mailTexts.CONTACT_REQUEST_USER_MAIL_SUBJECT);
    const mailPage = await openMail(page, confirmation);
    await expect(mailPage.getByText(mailTexts.CONTACT_REQUEST_USER_TITLE)).toBeVisible();
    await expect(mailPage.locator("strong", { hasText: name })).toBeVisible();
    await expect(
      mailPage.getByText(mailTexts.CONTACT_REQUEST_USER_INTRO(mailTexts.CONTACT_PREFERENCE_EMAIL_SENTENCE))
    ).toBeVisible();
    await expect(mailPage.getByText(email, { exact: true })).toBeVisible();
    // The header image is embedded in the mail itself, not linked
    await expect(mailPage.locator("img").first()).toHaveJSProperty("complete", true);
    expect(await mailPage.locator("img").first().evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    await docScreenshot(mailPage.locator("body"), "UC-CONTACT-02-email");
    await mailPage.close();

    // ...and the organisers get the address to write to
    const adminMail = await waitForMail(isAdminMailFor(name));
    expect(adminMail.html).toContain(`mailto:${email}`);
  });

  test("Hiányzó vagy hibás adatok", useCase("UC-CONTACT-03"), async ({ page }) => {
    const block = contactBlock(page);

    // Nothing filled in
    await block.submit.click();

    await expect(block.name).toHaveAccessibleDescription(hu.MESSAGES.invalidName);
    await expect(block.phone).toHaveAccessibleDescription(hu.MESSAGES.invalidPhone);
    await docScreenshot(block.section, "UC-CONTACT-03-missing");

    // An address the browser accepts but which has no domain ending
    await block.option(hu.CONTACT_REQUEST_EMAIL_OPTION).click();
    await block.name.fill(uniqueName());
    await block.email.fill("teszt@pelda");
    await block.submit.click();

    await expect(block.email).toHaveAccessibleDescription(hu.MESSAGES.emailInvalid);
    await expect(block.name).not.toHaveAccessibleDescription(hu.MESSAGES.invalidName);
    await expect(block.newRequest).toHaveCount(0);
    await docScreenshot(block.section, "UC-CONTACT-03-invalid-email");
  });

  test("Ismételt kérés ugyanazzal az elérhetőséggel", useCase("UC-CONTACT-04"), async ({ page }) => {
    const block = contactBlock(page);
    const phone = uniquePhone();

    await block.name.fill(uniqueName());
    await block.phone.fill(phone);
    await block.submit.click();
    await expect(block.alert).toHaveText(hu.MESSAGES.contactRequestSuccess);

    await block.newRequest.click();
    const secondName = uniqueName();
    await block.name.fill(secondName);
    await block.phone.fill(phone);
    await block.submit.click();

    await expect(block.alert).toHaveText(hu.MESSAGES.contactRequestAlreadyExists);
    // The form stays filled in, so the visitor can correct the number
    await expect(block.phone).toHaveValue(phone);
    await docScreenshot(block.section, "UC-CONTACT-04-duplicate");

    // A rejected request notifies nobody
    await page.waitForTimeout(2_000);
    expect(await mailsMatching((mail) => mail.html.includes(secondName))).toEqual([]);
  });
});
