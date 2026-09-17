import { writeFileSync } from "fs";
import { emailWrapper } from "../templates/layout";
import { getStrapiTexts } from "../../../i18n/get-strapi-texts";
import { userEmailContent } from "../templates/event-signup";
import { getClientUrl } from "../../config/client-url";

const texts = getStrapiTexts();

const html = emailWrapper(
  getClientUrl(),
  userEmailContent(
  texts,
    "János",
    "Kovács",
    "Kilimandzsáró túra 2025",
    "250000",
    2,
    "Ft",
    "12345678-87654321-00000000",
    "Gyertek Velünk Kft.",
    "info@gyertekvelunk.eu",
    "Gyertek Velünk"
  ),
  texts.SYSTEM_EMAIL_SUBJECT.eventSignup,
  texts,
  "Gyertek Velünk"
);

const outputPath = process.argv[2];
if (!outputPath) {
  console.error("Usage: ts-node event-signup-user-preview.ts <output.html>");
  process.exit(1);
}
writeFileSync(outputPath, html, "utf-8");
console.log(`Written to: ${outputPath}`);
