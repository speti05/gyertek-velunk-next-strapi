import path from "path";
import { getTransporter } from "./mailer";
import { newsletterEmailWrapper } from "./templates/newsletter";
import { blocksToHtml } from "../../api/newsletter/services/blocks-to-html";
import { buildUnsubscribeUrl } from "../../api/newsletter/services/unsubscribe-token";
import { getSiteSettings } from "./get-site-settings";
import { getStrapiTexts } from "../../i18n/get-strapi-texts";

const headerAttachment = {
  filename: "hirlevel-fejlec-1100.jpg",
  path: path.join(process.cwd(), "src/lib/email/templates/hirlevel-fejlec-1100.jpg"),
  cid: "hirlevel-fejlec",
};

export const sendNewsletterBroadcast = async (
  subject: string,
  body: unknown,
  recipients: string[]
): Promise<number> => {
  const transporter = await getTransporter();
  // A newsletter signup stores only an e-mail address, so the recipient's language is
  // unknown here. The broadcast goes out in the default locale.
  const texts = getStrapiTexts();
  const bodyHtml = blocksToHtml(body);
  const { organizationName } = await getSiteSettings();
  let sentCount = 0;

  console.info(`Sending newsletter "${subject}" to ${recipients.length} recipient(s)`);

  for (const recipient of recipients) {
    try {
      await transporter.sendMail({
        from: `"${organizationName}" <${process.env.SMTP_USER}>`,
        to: recipient,
        subject,
        html: newsletterEmailWrapper(texts, subject, bodyHtml, buildUnsubscribeUrl(recipient), organizationName),
        attachments: [headerAttachment],
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
