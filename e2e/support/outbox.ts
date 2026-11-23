import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { expect } from "@playwright/test";
import type { OutboxMail } from "@server/lib/email/outbox";

export type { OutboxMail };

/**
 * Where the e2e Strapi saves a copy of every e-mail it sends (EMAIL_OUTBOX_DIR, see
 * server/src/lib/email/outbox.ts). It sits next to the database copy, so scripts/run.mjs
 * deletes it together with that after the run.
 */
export const OUTBOX_DIR = path.resolve(__dirname, "../../server/.tmp/e2e/outbox");

async function readOutbox(): Promise<OutboxMail[]> {
  const files = await readdir(OUTBOX_DIR).catch(() => [] as string[]);
  const mails = await Promise.all(
    files
      .filter((file) => file.endsWith(".json"))
      .map(async (file) => {
        try {
          return JSON.parse(await readFile(path.join(OUTBOX_DIR, file), "utf8")) as OutboxMail;
        } catch {
          return null; // still being written - picked up on the next poll
        }
      })
  );
  return mails.filter((mail): mail is OutboxMail => mail !== null);
}

/**
 * Waits for the e-mail matching `predicate`. The server sends its mails after it answered
 * the request (and retries failed attempts), so this polls instead of reading once.
 */
export async function waitForMail(predicate: (mail: OutboxMail) => boolean, timeout = 30_000) {
  let found: OutboxMail | undefined;
  await expect
    .poll(
      async () => {
        found = (await readOutbox()).find(predicate);
        return !!found;
      },
      { timeout, message: "the expected e-mail never reached the outbox" }
    )
    .toBe(true);
  return found!;
}

/** Every mail matching `predicate` that is in the outbox right now. */
export async function mailsMatching(predicate: (mail: OutboxMail) => boolean) {
  return (await readOutbox()).filter(predicate);
}
