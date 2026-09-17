import { writeFileSync, mkdirSync } from "fs";
import { emailWrapper } from "../templates/layout";
import { getStrapiTexts } from "../../../i18n/get-strapi-texts";
import { adminContactRequestEmailContent } from "../templates/contact-request";
import { getClientUrl } from "../../config/client-url";

const texts = getStrapiTexts();

// Variant A: phone + email both provided
const htmlBoth = emailWrapper(
  getClientUrl(),
  adminContactRequestEmailContent(texts, "Kovács János", "+36 30 123 4567", "kovacs.janos@example.com", "phone"),
  texts.SYSTEM_EMAIL_SUBJECT.contactRequestAdmin,
  texts,
  "Gyertek Velünk"
);

// Variant B: email only
const htmlEmailOnly = emailWrapper(
  getClientUrl(),
  adminContactRequestEmailContent(texts, "Nagy Éva", null, "nagy.eva@example.com", "email"),
  texts.SYSTEM_EMAIL_SUBJECT.contactRequestAdmin,
  texts,
  "Gyertek Velünk"
);

// Variant C: phone only
const htmlPhoneOnly = emailWrapper(
  getClientUrl(),
  adminContactRequestEmailContent(texts, "Kiss Péter", "+36 70 987 6543", null, "phone"),
  texts.SYSTEM_EMAIL_SUBJECT.contactRequestAdmin,
  texts,
  "Gyertek Velünk"
);

const outputPath = process.argv[2];
if (!outputPath) {
  console.error("Usage: ts-node contact-request-admin-preview.ts <output-dir>");
  process.exit(1);
}

mkdirSync(outputPath, { recursive: true });

writeFileSync(`${outputPath}/contact-request-admin-both.html`, htmlBoth, "utf-8");
writeFileSync(`${outputPath}/contact-request-admin-email-only.html`, htmlEmailOnly, "utf-8");
writeFileSync(`${outputPath}/contact-request-admin-phone-only.html`, htmlPhoneOnly, "utf-8");

console.log(`Written 3 variants to: ${outputPath}`);
