import { EMAIL_HEADER_ATTACHMENT } from "./header-attachment";
import { getTransporter } from "./mailer";
import { emailWrapper } from "./templates/layout";
import { userEmailContent, adminEmailContent } from "./templates/newsletter-signup";
import { getSiteSettings } from "./get-site-settings";
import { getClientUrl } from "../config/client-url";
import { getStrapiTexts, type Locale } from "../../i18n/get-strapi-texts";

export const sendNewsletterSignupEmails = async (subscriberEmail: string, locale: Locale) => {
  const texts = getStrapiTexts(locale);
  const transporter = await getTransporter();
  const siteUrl = getClientUrl();
  const { organizationName } = await getSiteSettings();

  console.info(`Sending newsletter signup emails for ${subscriberEmail}`);

  await transporter.sendMail({
    from: `"${organizationName}" <${process.env.SMTP_USER}>`,
    to: subscriberEmail,
    subject: texts.NEWSLETTER_SIGNUP_USER_MAIL_SUBJECT,
    html: emailWrapper(siteUrl, userEmailContent(texts, subscriberEmail), texts.SYSTEM_EMAIL_SUBJECT.newsletterSignup, texts, organizationName),
    attachments: [EMAIL_HEADER_ATTACHMENT],
  });

  await transporter.sendMail({
    from: `"${organizationName}" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: texts.NEWSLETTER_SIGNUP_ADMIN_MAIL_SUBJECT,
    html: emailWrapper(siteUrl, adminEmailContent(texts, subscriberEmail), texts.SYSTEM_EMAIL_SUBJECT.newsletterSignup, texts, organizationName),
    attachments: [EMAIL_HEADER_ATTACHMENT],
  });

  console.info(`Newsletter signup emails sent for ${subscriberEmail}`);
};
