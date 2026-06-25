import path from "path";
import { getTransporter } from "./mailer";
import { emailWrapper, SystemEmailSubject } from "./templates/layout";
import { userEmailContent, adminEmailContent } from "./templates/event-signup";
import { getSiteSettings } from "./get-site-settings";

const headerAttachment = {
  filename: "email-fejlec-600.jpg",
  path: path.join(process.cwd(), "src/lib/email/templates/email-fejlec-600.jpg"),
  cid: "email-fejlec",
};

interface CompanionData {
  lastName: string;
  firstName: string;
  phone: string;
  birthCountry: string;
  birthPlace: string;
  birthDate: string;
  documentType: string;
  documentNumber: string;
  documentIssueDate: string;
  documentExpiryDate: string;
  allergies: string;
  fbLink: string;
}

export const sendSignupEmails = async (signupData: {
  userEmail: string;
  firstName: string;
  lastName: string;
  eventName: string;
  telephone: string;
  billingCountry?: string;
  billingCity?: string;
  billingZip?: string;
  billingStreet?: string;
  billingHouseNumber?: string;
  wantInvoice?: boolean;
  companyName?: string;
  taxNumber?: string;
  birthCountry?: string;
  birthPlace?: string;
  birthDate?: string;
  documentType?: string;
  documentNumber?: string;
  documentIssueDate?: string;
  documentExpiryDate?: string;
  allergies?: string;
  fbLink?: string;
  companions?: CompanionData[];
  notes?: string;
  eventPrice?: string;
}) => {
  const t = await getTransporter();
  const {
    userEmail, firstName, lastName, eventName, telephone,
    billingCountry, billingCity, billingZip, billingStreet, billingHouseNumber,
    wantInvoice, companyName, taxNumber,
    birthCountry, birthPlace, birthDate,
    documentType, documentNumber, documentIssueDate, documentExpiryDate,
    allergies, fbLink, companions, notes, eventPrice,
  } = signupData;
  const siteUrl = process.env.SITE_URL;
  const settings = await getSiteSettings();
  const { organizationName, contactEmail, bankAccountNumber, bankBeneficiaryName, defaultCurrency } = settings;

  console.info(
    `Sending event signup emails for ${userEmail} (${firstName} ${lastName}) for event ${eventName}`
  );

  await t.sendMail({
    from: `"${organizationName}" <${process.env.SMTP_USER}>`,
    to: userEmail,
    subject: `Sikeres túrajelentkezés – ${eventName}`,
    html: emailWrapper(
      siteUrl,
      userEmailContent(firstName, lastName, eventName, eventPrice, 1 + (companions?.length ?? 0), defaultCurrency, bankAccountNumber, bankBeneficiaryName, contactEmail, organizationName),
      SystemEmailSubject.EventSignup,
      organizationName
    ),
    attachments: [headerAttachment],
  });

  await t.sendMail({
    from: `"${organizationName} Túrajelentkezés" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `Túrajelentkezés: ${eventName}`,
    html: emailWrapper(
      siteUrl,
      adminEmailContent({
        firstName, lastName, userEmail, eventName, telephone,
        billingCountry, billingCity, billingZip, billingStreet, billingHouseNumber,
        wantInvoice, companyName, taxNumber,
        birthCountry, birthPlace, birthDate,
        documentType, documentNumber, documentIssueDate, documentExpiryDate,
        allergies, fbLink, companions, notes,
      }),
      SystemEmailSubject.EventSignupAdmin,
      organizationName
    ),
    attachments: [headerAttachment],
  });

  console.info(`Event signup emails sent for ${userEmail}, event: ${eventName}`);
};
