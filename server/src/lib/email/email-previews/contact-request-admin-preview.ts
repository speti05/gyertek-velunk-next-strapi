import { writeFileSync, mkdirSync } from "fs";
import { emailWrapper, SystemEmailSubject } from "../templates/layout";
import { adminContactRequestEmailContent } from "../templates/contact-request";

// Variant A: phone + email both provided
const htmlBoth = emailWrapper(
  "https://gyertekvelunk.eu",
  adminContactRequestEmailContent("Kovács János", "+36 30 123 4567", "kovacs.janos@example.com", "phone"),
  SystemEmailSubject.ContactRequestAdmin,
  "Gyertek Velünk"
);

// Variant B: email only
const htmlEmailOnly = emailWrapper(
  "https://gyertekvelunk.eu",
  adminContactRequestEmailContent("Nagy Éva", null, "nagy.eva@example.com", "email"),
  SystemEmailSubject.ContactRequestAdmin,
  "Gyertek Velünk"
);

// Variant C: phone only
const htmlPhoneOnly = emailWrapper(
  "https://gyertekvelunk.eu",
  adminContactRequestEmailContent("Kiss Péter", "+36 70 987 6543", null, "phone"),
  SystemEmailSubject.ContactRequestAdmin,
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
