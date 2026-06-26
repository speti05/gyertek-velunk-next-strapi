import { writeFileSync } from "fs";
import { emailWrapper, SystemEmailSubject } from "../templates/layout";
import { adminEmailContent } from "../templates/newsletter-signup";

const html = emailWrapper(
  "https://gyertekvelunk.eu",
  adminEmailContent("teszt.felhasznalo@example.com"),
  SystemEmailSubject.NewsletterSignup,
  "Gyertek Velünk"
);

const outputPath = process.argv[2];
if (!outputPath) {
  console.error("Usage: ts-node newsletter-signup-admin-preview.ts <output.html>");
  process.exit(1);
}
writeFileSync(outputPath, html, "utf-8");
console.log(`Written to: ${outputPath}`);
