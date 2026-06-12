import path from "path";
import { getTransporter } from "./mailer";
import { emailWrapper, SystemEmailSubject } from "./templates/layout";
import { userEmailContent, adminEmailContent } from "./templates/newsletter-signup";

const headerAttachment = {
  filename: "email-fejlec-600.jpg",
  path: path.join(process.cwd(), "src/lib/email/templates/email-fejlec-600.jpg"),
  cid: "email-fejlec",
};

export const sendNewsletterSignupEmails = async (subscriberEmail: string) => {
  const t = await getTransporter();
  const siteUrl = process.env.SITE_URL;

  console.info(`Sending newsletter signup emails for ${subscriberEmail}`);

  await t.sendMail({
    from: `"Gyertek velünk" <${process.env.SMTP_USER}>`,
    to: subscriberEmail,
    subject: "Sikeres hírlevél feliratkozás",
    html: emailWrapper(siteUrl, userEmailContent(subscriberEmail), SystemEmailSubject.NewsletterSignup),
    attachments: [headerAttachment],
  });

  await t.sendMail({
    from: `"Gyertek velünk" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "Új hírlevél feliratkozás",
    html: emailWrapper(siteUrl, adminEmailContent(subscriberEmail), SystemEmailSubject.NewsletterSignup),
    attachments: [headerAttachment],
  });

  console.info(`Newsletter signup emails sent for ${subscriberEmail}`);
};
