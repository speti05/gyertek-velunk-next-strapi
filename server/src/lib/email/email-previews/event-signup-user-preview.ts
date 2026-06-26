import { writeFileSync } from "fs";
import { emailWrapper, SystemEmailSubject } from "../templates/layout";
import { userEmailContent } from "../templates/event-signup";

const html = emailWrapper(
  "https://gyertekvelunk.eu",
  userEmailContent(
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
  SystemEmailSubject.EventSignup,
  "Gyertek Velünk"
);

const outputPath = process.argv[2];
if (!outputPath) {
  console.error("Usage: ts-node event-signup-user-preview.ts <output.html>");
  process.exit(1);
}
writeFileSync(outputPath, html, "utf-8");
console.log(`Written to: ${outputPath}`);
