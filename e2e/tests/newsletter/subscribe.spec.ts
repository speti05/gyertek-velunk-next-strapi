import { expect, test, type Page } from "@playwright/test";
import { docScreenshot, useCase } from "../../support/docs";
import { hu, openPage, uniqueEmail } from "../../support/site";

// Docs: docs-site/src/content/docs/hirlevel/feliratkozas.mdx

/** The Subscribe block on the home page (rendered client-side only). */
function newsletterBlock(page: Page) {
  const section = page.locator("section.newsletter");
  return {
    section,
    email: section.getByRole("textbox"),
    submit: section.getByRole("button"),
    alert: section.getByRole("alert"),
  };
}

async function subscribe(page: Page, email: string) {
  const block = newsletterBlock(page);
  await block.email.fill(email);
  await block.submit.click();
  return block;
}

test.describe("Hírlevél feliratkozás", () => {
  test.beforeEach(async ({ page }) => {
    await openPage(page, "/");
    await newsletterBlock(page).section.scrollIntoViewIfNeeded();
  });

  test("Feliratkozás érvényes e-mail címmel", useCase("UC-NEWS-01"), async ({ page }) => {
    const block = newsletterBlock(page);
    await docScreenshot(block.section, "UC-NEWS-01-form");

    await subscribe(page, uniqueEmail());

    await expect(block.alert).toHaveText(hu.MESSAGES.succesfullySubscribed);
    await expect(block.email).toHaveValue("");
    await docScreenshot(block.section, "UC-NEWS-01-success");
  });

  test("Érvénytelen e-mail cím", useCase("UC-NEWS-02"), async ({ page }) => {
    const block = await subscribe(page, "nem-email-cim");

    await expect(block.alert).toHaveText(hu.MESSAGES.emailInvalid);
    await docScreenshot(block.section, "UC-NEWS-02-invalid");
  });

  test("Már feliratkozott e-mail cím", useCase("UC-NEWS-03"), async ({ page }) => {
    const email = uniqueEmail();
    const block = await subscribe(page, email);
    await expect(block.alert).toHaveText(hu.MESSAGES.succesfullySubscribed);

    await subscribe(page, email);

    await expect(block.alert).toHaveText(hu.MESSAGES.emailAlreadySubscribed);
    await docScreenshot(block.section, "UC-NEWS-03-duplicate");
  });
});
