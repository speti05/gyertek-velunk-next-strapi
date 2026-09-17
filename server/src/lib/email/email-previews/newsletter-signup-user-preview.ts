import { writeFileSync } from "fs";
import { emailWrapper } from "../templates/layout";
import { getStrapiTexts } from "../../../i18n/get-strapi-texts";
import { userEmailContent } from "../templates/newsletter-signup";
import { getClientUrl } from "../../config/client-url";

const texts = getStrapiTexts();

const html = emailWrapper(
  getClientUrl(),
  userEmailContent(texts, "teszt.felhasznalo@example.com"),
  texts.SYSTEM_EMAIL_SUBJECT.newsletterSignup,
  texts,
  "Gyertek Velünk"
);

const outputPath = process.argv[2];
if (!outputPath) {
  console.error("Usage: ts-node newsletter-signup-user-preview.ts <output.html>");
  process.exit(1);
}
writeFileSync(outputPath, html, "utf-8");
console.log(`Written to: ${outputPath}`);
