import path from "path";
import { getTransporter } from "./mailer";
import { newsletterEmailWrapper } from "./templates/newsletter";
import { blocksToHtml } from "../../api/newsletter/services/blocks-to-html";
import { buildUnsubscribeUrl } from "../../api/newsletter/services/unsubscribe-token";

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
  const t = await getTransporter();
  const bodyHtml = blocksToHtml(body);
  let sentCount = 0;

  console.info(`Sending newsletter "${subject}" to ${recipients.length} recipient(s)`);

  for (const recipient of recipients) {
    try {
      await t.sendMail({
        from: `"Gyertek velünk" <${process.env.SMTP_USER}>`,
        to: recipient,
        subject,
        html: newsletterEmailWrapper(subject, bodyHtml, buildUnsubscribeUrl(recipient)),
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
