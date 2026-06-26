import { writeFileSync } from "fs";
import { mkdirSync } from "fs";
import { emailWrapper, SystemEmailSubject } from "../templates/layout";
import { adminEmailContent } from "../templates/event-signup";

// Variant A: full data with 1 companion, invoice requested
const htmlFull = emailWrapper(
  "https://gyertekvelunk.eu",
  adminEmailContent({
    firstName: "János",
    lastName: "Kovács",
    userEmail: "kovacs.janos@example.com",
    eventName: "Kilimandzsáró túra 2025",
    telephone: "+36 30 123 4567",
    billingCountry: "Magyarország",
    billingCity: "Budapest",
    billingZip: "1111",
    billingStreet: "Fő utca",
    billingHouseNumber: "12.",
    wantInvoice: true,
    companyName: "Kovács Kft.",
    taxNumber: "12345678142",
    birthCountry: "Magyarország",
    birthPlace: "Budapest",
    birthDate: "1985-03-15",
    documentType: "Útlevél",
    documentNumber: "AB1234567",
    documentIssueDate: "2020-01-10",
    documentExpiryDate: "2030-01-09",
    allergies: "Laktózérzékeny",
    fbLink: "https://facebook.com/kovacs.janos",
    companions: [
      {
        lastName: "Kovács",
        firstName: "Mária",
        phone: "+36 70 111 2222",
        birthCountry: "Magyarország",
        birthPlace: "Pécs",
        birthDate: "1988-07-22",
        documentType: "Személyi igazolvány",
        documentNumber: "123456AB",
        documentIssueDate: "2019-05-01",
        documentExpiryDate: "2029-04-30",
        allergies: "",
        fbLink: "",
      },
    ],
    notes: "Kérem, hogy a szállást lehetőleg kettős szobában foglalják!",
  }),
  SystemEmailSubject.EventSignupAdmin,
  "Gyertek Velünk"
);

// Variant B: minimal data, no companion, no invoice
const htmlMinimal = emailWrapper(
  "https://gyertekvelunk.eu",
  adminEmailContent({
    firstName: "Éva",
    lastName: "Nagy",
    userEmail: "nagy.eva@example.com",
    eventName: "Machu Picchu túra 2025",
    telephone: "+36 20 555 6789",
    wantInvoice: false,
  }),
  SystemEmailSubject.EventSignupAdmin,
  "Gyertek Velünk"
);

const outputPath = process.argv[2];
if (!outputPath) {
  console.error("Usage: ts-node event-signup-admin-preview.ts <output-dir>");
  process.exit(1);
}

mkdirSync(outputPath, { recursive: true });

writeFileSync(`${outputPath}/event-signup-admin-full.html`, htmlFull, "utf-8");
writeFileSync(`${outputPath}/event-signup-admin-minimal.html`, htmlMinimal, "utf-8");

console.log(`Written 2 variants to: ${outputPath}`);
