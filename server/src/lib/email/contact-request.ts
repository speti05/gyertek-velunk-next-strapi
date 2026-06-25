import path from "path";
import { getTransporter } from "./mailer";
import { emailWrapper, SystemEmailSubject } from "./templates/layout";
import { adminContactRequestEmailContent } from "./templates/contact-request";
import { getSiteSettings } from "./get-site-settings";

const headerAttachment = {
  filename: "email-fejlec-600.jpg",
  path: path.join(process.cwd(), "src/lib/email/templates/email-fejlec-600.jpg"),
  cid: "email-fejlec",
};

export const sendContactRequestEmail = async (data: {
  name: string;
  phone: string | null;
  email: string | null;
  preferredContact: string;
}) => {
  const t = await getTransporter();
  const { name, phone, email, preferredContact } = data;
  const siteUrl = process.env.SITE_URL;
  const { organizationName } = await getSiteSettings();

  console.info(`Sending contact request email for ${name}, preferred: ${preferredContact}`);

  await t.sendMail({
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
  });

  console.info(`Contact request email sent for admin, from ${name}`);
};
