import path from "path";
import { readFileSync } from "fs";
import type { Attachment } from "nodemailer/lib/mailer";

/**
 * The email header image, embedded inline and referenced as `cid:email-fejlec` by the
 * layout template. It is read into a Buffer once instead of being passed as a `path`:
 * Strapi's nodemailer provider forces `disableFileAccess`, which rejects path attachments.
 */
export const EMAIL_HEADER_ATTACHMENT: Attachment = {
  filename: "email-fejlec-600.jpg",
  content: readFileSync(path.join(process.cwd(), "src/lib/email/templates/email-fejlec-600.jpg")),
  cid: "email-fejlec",
};
