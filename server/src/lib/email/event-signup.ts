import path from "path";
import { getTransporter } from "./mailer";
import { emailWrapper } from "./templates/layout";
import { userEmailContent, adminEmailContent } from "./templates/event-signup";
import { getSiteSettings } from "./get-site-settings";
import { getTravelContractAttachment } from "./travel-contract-attachment";
import { getClientUrl } from "../config/client-url";
import { getStrapiTexts, type Locale } from "../../i18n/get-strapi-texts";

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

export const sendSignupEmails = async (
  signupData: {
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
  },
  locale: Locale
) => {
  const texts = getStrapiTexts(locale);
  const transporter = await getTransporter();
  const {
    userEmail, firstName, lastName, eventName, telephone,
    billingCountry, billingCity, billingZip, billingStreet, billingHouseNumber,
    wantInvoice, companyName, taxNumber,
    birthCountry, birthPlace, birthDate,
    documentType, documentNumber, documentIssueDate, documentExpiryDate,
    allergies, fbLink, companions, notes, eventPrice,
  } = signupData;
  const siteUrl = getClientUrl();
  const settings = await getSiteSettings();
  const { organizationName, contactEmail, bankAccountNumber, bankBeneficiaryName, defaultCurrency } = settings;

  console.info(
    `Sending event signup emails for ${userEmail} (${firstName} ${lastName}) for event ${eventName}`
  );

  const travelContractAttachment = await getTravelContractAttachment(locale).catch((err) => {
    console.error("Failed to build travel contract attachment:", err);
    return null;
  });

  await transporter.sendMail({
    from: `"${organizationName}" <${process.env.SMTP_USER}>`,
    to: userEmail,
    subject: texts.EVENT_SIGNUP_USER_MAIL_SUBJECT(eventName),
    html: emailWrapper(
      siteUrl,
      userEmailContent(texts, firstName, lastName, eventName, eventPrice, 1 + (companions?.length ?? 0), defaultCurrency, bankAccountNumber, bankBeneficiaryName, contactEmail, organizationName),
      texts.SYSTEM_EMAIL_SUBJECT.eventSignup,
      texts,
      organizationName
    ),
    attachments: travelContractAttachment
      ? [headerAttachment, travelContractAttachment]
      : [headerAttachment],
  });

  await transporter.sendMail({
    from: `"${texts.EVENT_SIGNUP_FROM_NAME(organizationName)}" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: texts.EVENT_SIGNUP_ADMIN_MAIL_SUBJECT(eventName),
    html: emailWrapper(
      siteUrl,
      adminEmailContent(texts, {
        firstName, lastName, userEmail, eventName, telephone,
        billingCountry, billingCity, billingZip, billingStreet, billingHouseNumber,
        wantInvoice, companyName, taxNumber,
        birthCountry, birthPlace, birthDate,
        documentType, documentNumber, documentIssueDate, documentExpiryDate,
        allergies, fbLink, companions, notes,
      }),
      texts.SYSTEM_EMAIL_SUBJECT.eventSignupAdmin,
      texts,
      organizationName
    ),
    attachments: [headerAttachment],
  });

  console.info(`Event signup emails sent for ${userEmail}, event: ${eventName}`);
};
