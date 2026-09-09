import path from "path";
import { getTransporter } from "./mailer";
import { sendMailWithRetry } from "./send-with-retry";
import { emailWrapper, SystemEmailSubject } from "./templates/layout";
import {
  adminContactRequestEmailContent,
  userContactRequestEmailContent,
} from "./templates/contact-request";
import { getSiteSettings } from "./get-site-settings";
import { getClientUrl } from "../config/client-url";

const headerAttachment = {
  filename: "email-fejlec-600.jpg",
  path: path.join(process.cwd(), "src/lib/email/templates/email-fejlec-600.jpg"),
  cid: "email-fejlec",
};

/**
 * Sends the admin notification about a contact request and, when the requester
 * left an email address, a confirmation to the requester as well.
 *
 * Each mail is sent independently so one failure cannot suppress the other.
 * If any of them failed after its retries, the collected errors are rethrown
 * so the caller can log and alert.
 */
export const sendContactRequestEmails = async (data: {
  name: string;
  phone: string | null;
  email: string | null;
  preferredContact: string;
}) => {
  const t = await getTransporter();
  const { name, phone, email, preferredContact } = data;
  const siteUrl = getClientUrl();
  const { organizationName } = await getSiteSettings();

  console.info(`Sending contact request emails for ${name}, preferred: ${preferredContact}`);

  const failures: string[] = [];

  try {
    await sendMailWithRetry(
      t,
      {
        from: `"${organizationName} Kapcsolatfelvétel" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: "Új visszahívás / megkeresés",
        html: emailWrapper(
          siteUrl,
          adminContactRequestEmailContent(name, phone, email, preferredContact),
          SystemEmailSubject.ContactRequestAdmin,
          organizationName
        ),
        attachments: [headerAttachment],
      },
      "contact request admin notification"
    );
    console.info(`Contact request admin email sent, from ${name}`);
  } catch (err) {
    failures.push(`admin notification: ${(err as Error).message}`);
  }

  // The confirmation can only be sent to someone who gave us an email address.
  // Requesters who asked to be called back leave a phone number only.
  if (email) {
    try {
      await sendMailWithRetry(
        t,
        {
          from: `"${organizationName}" <${process.env.SMTP_USER}>`,
          to: email,
          subject: "Megkaptuk a megkeresésedet",
          html: emailWrapper(
            siteUrl,
            userContactRequestEmailContent(
              name,
              preferredContact,
              preferredContact === "phone" ? (phone ?? email) : email,
              organizationName
            ),
            SystemEmailSubject.ContactRequest,
            organizationName
          ),
          attachments: [headerAttachment],
        },
        "contact request confirmation"
      );
      console.info(`Contact request confirmation email sent to ${email}`);
    } catch (err) {
      failures.push(`confirmation to ${email}: ${(err as Error).message}`);
    }
  } else {
    console.info(`No email address given by ${name}, confirmation email skipped`);
  }

  if (failures.length > 0) {
    throw new Error(failures.join(" | "));
  }
};
