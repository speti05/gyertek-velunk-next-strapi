import { getTransporter } from "./mailer";
import { newsletterEmailWrapper } from "./templates/newsletter";
import { buildUnsubscribeUrl } from "../../api/newsletter/services/unsubscribe-token";
import { getSiteSettings } from "./get-site-settings";
import { getStrapiTexts } from "../../i18n/get-strapi-texts";
import { buildNewsletterEmail, type NewsletterContent } from "./newsletter/build-newsletter";

export const sendNewsletterBroadcast = async (
  newsletter: NewsletterContent,
  recipients: string[]
): Promise<number> => {
  const transporter = await getTransporter();
  // A newsletter signup stores only an e-mail address, so the recipient's language is
  // unknown here. The broadcast goes out in the default locale.
  const texts = getStrapiTexts();
  const { organizationName } = await getSiteSettings();
  // Built once for every recipient; throws before anything is sent when the mail is too large.
  const { subject, bodyHtml, attachments } = await buildNewsletterEmail(newsletter, organizationName);
  let sentCount = 0;

  console.info(`Sending newsletter "${subject}" to ${recipients.length} recipient(s)`);

  for (const recipient of recipients) {
    try {
      await transporter.sendMail({
        from: `"${organizationName}" <${process.env.SMTP_USER}>`,
        to: recipient,
        subject,
        html: newsletterEmailWrapper(texts, subject, bodyHtml, buildUnsubscribeUrl(recipient), organizationName),
        attachments,
      });
      sentCount++;
      console.info(`Newsletter "${subject}" sent to ${recipient}`);
    } catch (err) {
      console.error(`Failed to send newsletter to ${recipient}:`, err);
    }
  }

  console.info(`Newsletter "${subject}" sent to ${sentCount}/${recipients.length} recipients`);
  return sentCount;
};
