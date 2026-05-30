import nodemailer from "nodemailer";
import { blocksToHtml } from "./blocks-to-html";
import { buildUnsubscribeUrl } from "./unsubscribe-token";

let transporter: nodemailer.Transporter;

const setupTransporter = () => {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
};

setupTransporter();

const emailWrapper = (subject: string, content: string, unsubscribeUrl: string) => {
  const year = new Date().getFullYear();
  const siteUrl = process.env.SITE_URL;
  return `<!DOCTYPE html>
      <html lang="hu">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Source+Sans+3:wght@300;400;600&display=swap');</style>
</head>
<body style="margin:0;padding:0;font-family:'Source Sans 3',Arial,sans-serif;background-color:#F1E8D9;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F1E8D9">
    <tr>
      <td align="center" style="padding:30px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.12);">
          <tr>
            <td bgcolor="#377F76" style="padding:24px 40px;text-align:center;">
              <h1 style="font-family:'Luckiest Guy',cursive;color:#ffffff;margin:0;font-size:32px;letter-spacing:2px;line-height:1.2;font-weight:400;">${subject}</h1>
              <h2 style="font-family:'Luckiest Guy',cursive;color:#B0DFD8;margin:8px 0 0;font-size:18px;line-height:1.2;font-weight:400;">Gyertek velünk hírlevél</h2>
            </td>
          </tr>
          <tr>
            <td bgcolor="#ffffff" style="padding:48px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td bgcolor="#70634C" style="padding:28px 40px;text-align:center;">
              <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#F1E8D9;font-size:14px;margin:0 0 6px;line-height:1.6;">
                &copy; ${year} Gyertek velünk &mdash; Minden jog fenntartva.
              </p>
              ${siteUrl ? `<a href="${siteUrl}" style="font-family:'Source Sans 3',Arial,sans-serif;color:#B0DFD8;font-size:14px;text-decoration:none;">${siteUrl}</a>` : ""}
              <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#c9bba8;font-size:12px;margin:16px 0 0;line-height:1.6;">
                Nem szeretnél több hírlevelet kapni?
                <a href="${unsubscribeUrl}" style="color:#c9bba8;text-decoration:underline;">Leiratkozás</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export const sendNewsletterBroadcast = async (
  subject: string,
  body: unknown,
  recipients: string[]
): Promise<number> => {
  if (!transporter) setupTransporter();

  const bodyHtml = blocksToHtml(body);
  let sentCount = 0;

  if (process.env.NODE_ENV === "development") {
    const devHtml = emailWrapper(
      subject,
      bodyHtml,
      buildUnsubscribeUrl(recipients[0] ?? "test@example.com")
    );
    console.log(`[DEV] Newsletter "${subject}" would be sent to: ${recipients.join(", ")}`);
    console.log(`[DEV] HTML content: ${devHtml}`);
    return recipients.length;
  }

  for (const recipient of recipients) {
    try {
      const html = emailWrapper(subject, bodyHtml, buildUnsubscribeUrl(recipient));
      await transporter.sendMail({
        from: `"Gyertek velünk" <${process.env.SMTP_USER}>`,
        to: recipient,
        subject,
        html,
      });
      sentCount++;
    } catch (err) {
      console.error(`Failed to send newsletter to ${recipient}:`, err);
    }
  }

  return sentCount;
};
