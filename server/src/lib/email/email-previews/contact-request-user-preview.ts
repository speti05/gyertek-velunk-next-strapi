import { writeFileSync, mkdirSync } from "fs";
import { emailWrapper, SystemEmailSubject } from "../templates/layout";
import { userContactRequestEmailContent } from "../templates/contact-request";
import { getClientUrl } from "../../config/client-url";

// Variant A: the requester asked to be contacted by email
const htmlEmailPreferred = emailWrapper(
  getClientUrl(),
  userContactRequestEmailContent(
    "Nagy Éva",
    "email",
    "nagy.eva@example.com",
    "Gyertek Velünk"
  ),
  SystemEmailSubject.ContactRequest,
  "Gyertek Velünk"
);

// Variant B: the requester asked for a call back but also left an email address
const htmlPhonePreferred = emailWrapper(
  getClientUrl(),
  userContactRequestEmailContent(
    "Kovács János",
    "phone",
    "+36 30 123 4567",
    "Gyertek Velünk"
  ),
  SystemEmailSubject.ContactRequest,
  "Gyertek Velünk"
);

const outputPath = process.argv[2];
if (!outputPath) {
  console.error("Usage: ts-node contact-request-user-preview.ts <output-dir>");
  process.exit(1);
}

mkdirSync(outputPath, { recursive: true });

writeFileSync(`${outputPath}/contact-request-user-email-preferred.html`, htmlEmailPreferred, "utf-8");
writeFileSync(`${outputPath}/contact-request-user-phone-preferred.html`, htmlPhonePreferred, "utf-8");

console.log(`Written 2 variants to: ${outputPath}`);
