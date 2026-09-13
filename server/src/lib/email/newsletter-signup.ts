import path from "path";
import { getTransporter } from "./mailer";
import { emailWrapper } from "./templates/layout";
import { userEmailContent, adminEmailContent } from "./templates/newsletter-signup";
import { getSiteSettings } from "./get-site-settings";
import { getClientUrl } from "../config/client-url";
import {
  NEWSLETTER_SIGNUP_ADMIN_MAIL_SUBJECT,
  NEWSLETTER_SIGNUP_USER_MAIL_SUBJECT,
  SystemEmailSubject,
} from "../../utils/texts";

const headerAttachment = {
  filename: "email-fejlec-600.jpg",
  path: path.join(process.cwd(), "src/lib/email/templates/email-fejlec-600.jpg"),
  cid: "email-fejlec",
};

export const sendNewsletterSignupEmails = async (subscriberEmail: string) => {
  const t = await getTransporter();
  const siteUrl = getClientUrl();
  const { organizationName } = await getSiteSettings();

  console.info(`Sending newsletter signup emails for ${subscriberEmail}`);

  await t.sendMail({
    from: `"${organizationName}" <${process.env.SMTP_USER}>`,
    to: subscriberEmail,
    subject: NEWSLETTER_SIGNUP_USER_MAIL_SUBJECT,
    html: emailWrapper(siteUrl, userEmailContent(subscriberEmail), SystemEmailSubject.NewsletterSignup, organizationName),
    attachments: [headerAttachment],
  });

  await t.sendMail({
    from: `"${organizationName}" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: NEWSLETTER_SIGNUP_ADMIN_MAIL_SUBJECT,
    html: emailWrapper(siteUrl, adminEmailContent(subscriberEmail), SystemEmailSubject.NewsletterSignup, organizationName),
    attachments: [headerAttachment],
  });

  console.info(`Newsletter signup emails sent for ${subscriberEmail}`);
};
