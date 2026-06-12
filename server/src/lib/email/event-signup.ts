import path from "path";
import { getTransporter } from "./mailer";
import { emailWrapper, SystemEmailSubject } from "./templates/layout";
import { userEmailContent, adminEmailContent } from "./templates/event-signup";

const headerAttachment = {
  filename: "email-fejlec-600.jpg",
  path: path.join(process.cwd(), "src/lib/email/templates/email-fejlec-600.jpg"),
  cid: "email-fejlec",
};

export const sendSignupEmails = async (signupData: {
  userEmail: string;
  firstName: string;
  lastName: string;
  eventName: string;
  telephone: string;
}) => {
  const t = await getTransporter();
  const { userEmail, firstName, lastName, eventName, telephone } = signupData;
  const siteUrl = process.env.SITE_URL;

  console.info(
    `Sending event signup emails for ${userEmail} (${firstName} ${lastName}) for event ${eventName}`
  );

  await t.sendMail({
    from: `"Gyertek velünk" <${process.env.SMTP_USER}>`,
    to: userEmail,
    subject: `Sikeres túrajelentkezés – ${eventName}`,
    html: emailWrapper(siteUrl, userEmailContent(firstName, lastName, eventName), SystemEmailSubject.EventSignup),
    attachments: [headerAttachment],
  });

  await t.sendMail({
    from: `"Gyertek velünk Túrajelentkezés" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `Túrajelentkezés: ${eventName}`,
    html: emailWrapper(
      siteUrl,
      adminEmailContent(firstName, lastName, userEmail, eventName, telephone),
      SystemEmailSubject.EventSignupAdmin
    ),
    attachments: [headerAttachment],
  });

  console.info(`Event signup emails sent for ${userEmail}, event: ${eventName}`);
};
