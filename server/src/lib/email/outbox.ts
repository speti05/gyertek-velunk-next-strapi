import { mkdir, writeFile } from "fs/promises";
import path from "path";
import nodemailer from "nodemailer";
import type { SendMailOptions } from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer";

/**
 * A local copy of every e-mail the server sends, for the e2e tests to inspect.
 *
 * Only active while EMAIL_OUTBOX_DIR is set - e2e/playwright.config.ts sets it for the test
 * Strapi, nothing else does. Each mail becomes one JSON file in that directory, written
 * before the mail is handed to SMTP and updated once the sending is over - so the tests see
 * the generated mail right away, however slow (or unreachable) Ethereal is.
 * Inline images (`cid:` references) are swapped for data URIs, so the saved HTML renders on
 * its own the way a mail client shows it.
 */
export type OutboxMail = {
  label: string;
  from: string;
  to: string[];
  subject: string;
  html: string;
  status: "sending" | "delivered" | "failed";
  /** The Ethereal web view of the mail, once it was delivered there */
  previewUrl: string | null;
  createdAt: string;
};

const outboxDir = () => process.env.EMAIL_OUTBOX_DIR;

// "to" already covers everything "from" can hold (a string or an Address)
type Addresses = SendMailOptions["to"];

const addressList = (value: Addresses): string[] =>
  (Array.isArray(value) ? value : [value]).flatMap((address) => {
    if (!address) return [];
    return [typeof address === "string" ? address : address.address];
  });

const htmlOf = ({ html }: SendMailOptions): string =>
  typeof html === "string" ? html : Buffer.isBuffer(html) ? html.toString("utf8") : "";

const inlineImages = (html: string, attachments: Attachment[] = []) =>
  attachments.reduce((result, attachment) => {
    if (!attachment.cid || !Buffer.isBuffer(attachment.content)) return result;
    const type =
      attachment.contentType ??
      (attachment.filename?.toString().endsWith(".png") ? "image/png" : "image/jpeg");
    const dataUri = `data:${type};base64,${attachment.content.toString("base64")}`;
    return result.split(`cid:${attachment.cid}`).join(dataUri);
  }, html);

const writeMail = async (file: string, mail: OutboxMail) => {
  try {
    await writeFile(file, JSON.stringify(mail, null, 2));
  } catch (err) {
    console.warn(`Could not save "${mail.label}" to the e-mail outbox:`, (err as Error).message);
  }
};

/**
 * Saves the mail to the outbox as "sending" and returns the function that records how the
 * sending ended (the info nodemailer returned, or null when every attempt failed).
 * Both are no-ops while the outbox is off.
 */
export const addToOutbox = async (
  options: SendMailOptions,
  label: string
): Promise<(info: unknown) => Promise<void>> => {
  const dir = outboxDir();
  if (!dir) return async () => {};

  const mail: OutboxMail = {
    label,
    from: addressList(options.from).join(", "),
    to: addressList(options.to),
    subject: String(options.subject ?? ""),
    html: inlineImages(htmlOf(options), options.attachments),
    status: "sending",
    previewUrl: null,
    createdAt: new Date().toISOString(),
  };
  const file = path.join(dir, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.json`);

  try {
    await mkdir(dir, { recursive: true });
  } catch (err) {
    console.warn("Could not create the e-mail outbox:", (err as Error).message);
  }
  await writeMail(file, mail);

  return async (info) => {
    const previewUrl = info
      ? nodemailer.getTestMessageUrl(info as Parameters<typeof nodemailer.getTestMessageUrl>[0])
      : false;
    await writeMail(file, {
      ...mail,
      status: info ? "delivered" : "failed",
      previewUrl: previewUrl || null,
    });
  };
};
