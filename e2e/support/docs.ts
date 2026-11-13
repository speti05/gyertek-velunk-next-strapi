import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { test, type Locator, type Page } from "@playwright/test";

/** Where the docs site picks up the screenshots taken during the test run. */
const SCREENSHOT_DIR = path.resolve(__dirname, "../../docs-site/src/assets/screenshots");

/** The one project whose screenshots end up in the docs, so the projects do not overwrite each other. */
const DOCS_PROJECT = "desktop";

/**
 * Tags a test with the use case it covers. The same ID is listed in the `usecases`
 * frontmatter of the docs page describing it - scripts/build-coverage.mjs joins the two.
 * Run a single use case with `yarn test --grep @UC-NEWS-01`.
 */
export function useCase(id: `UC-${string}`) {
  return { tag: `@${id}` };
}

/**
 * Saves a screenshot for the docs (`docs-site/src/assets/screenshots/<name>.png`) and
 * embeds it in the HTML report as well. Only the desktop project writes it.
 */
export async function docScreenshot(target: Page | Locator, name: string) {
  const info = test.info();
  const body = await target.screenshot({ animations: "disabled" });
  await info.attach(name, { body, contentType: "image/png" });
  if (info.project.name !== DOCS_PROJECT) return;
  await mkdir(SCREENSHOT_DIR, { recursive: true });
  await writeFile(path.join(SCREENSHOT_DIR, `${name}.png`), body);
}
