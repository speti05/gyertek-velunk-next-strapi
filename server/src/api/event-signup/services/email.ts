// src/api/event-signup/services/email.ts
import nodemailer from 'nodemailer';

// For development/testing, use Ethereal (fake SMTP)
let transporter: nodemailer.Transporter;

const setupTransporter = async () => {
  if (process.env.NODE_ENV === 'development') {
    // Create a test account
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('Using Ethereal test account:', testAccount);
  } else {
    // Production: use real SMTP
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
};

// Initialize transporter
setupTransporter();

const emailHeader = () => `
  <tr>
    <td bgcolor="#377F76" style="padding:24px 40px;text-align:center;">
      <h1 style="font-family:'Luckiest Guy',cursive;color:#ffffff;margin:0;font-size:32px;letter-spacing:2px;line-height:1.2;font-weight:400;">Gyertek velünk</h1>
    </td>
  </tr>
`;

const emailFooter = (siteUrl: string | undefined, year: number) => `
  <tr>
    <td bgcolor="#70634C" style="padding:28px 40px;text-align:center;">
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#F1E8D9;font-size:14px;margin:0 0 6px;line-height:1.6;">
        &copy; ${year} Gyertek velünk &mdash; Minden jog fenntartva.
      </p>
      ${siteUrl ? `<a href="${siteUrl}" style="font-family:'Source Sans 3',Arial,sans-serif;color:#B0DFD8;font-size:14px;text-decoration:none;">${siteUrl}</a>` : ''}
    </td>
  </tr>
`;

const emailWrapper = (siteUrl: string | undefined, content: string) => {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Source+Sans+3:wght@300;400;600&display=swap');
  </style>
</head>
<body style="margin:0;padding:0;font-family:'Source Sans 3',Arial,sans-serif;background-color:#F1E8D9;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F1E8D9">
    <tr>
      <td align="center" style="padding:30px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.12);">
          ${emailHeader()}
          ${content}
          ${emailFooter(siteUrl, year)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const userEmailContent = (firstName: string, lastName: string, eventName: string) => `
  <tr>
    <td bgcolor="#ffffff" style="padding:48px 48px 40px;">

      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" style="padding-bottom:28px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td bgcolor="#B0DFD8" style="border-radius:50px;padding:8px 24px;">
                  <span style="font-family:'Source Sans 3',Arial,sans-serif;color:#377F76;font-weight:600;font-size:13px;letter-spacing:1px;text-transform:uppercase;">&#10003; Sikeres jelentkezés</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <h2 style="font-family:'Luckiest Guy',cursive;color:#377F76;font-size:26px;margin:0 0 20px;text-align:center;letter-spacing:1px;font-weight:400;">Megkaptuk a jelentkezésedet!</h2>

      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:16px;line-height:26px;margin:0 0 12px;">
        Kedves <strong>${lastName} ${firstName}</strong>,
      </p>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 32px;">
        Köszönjük a jelentkezésedet! Örömmel értesítünk, hogy regisztrációdat sikeresen fogadtuk.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:8px;overflow:hidden;border-left:4px solid #4FB6A9;">
        <tr>
          <td bgcolor="#F1E8D9" style="padding:20px 24px;">
            <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin:0 0 6px;">Kiválasztott túra</p>
            <p style="font-family:'Luckiest Guy',cursive;color:#377F76;font-size:22px;margin:0;letter-spacing:1px;font-weight:400;">${eventName}</p>
          </td>
        </tr>
      </table>

      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:32px 0 0;">
        Hamarosan felvesszük veled a kapcsolatot a túra részleteivel kapcsolatban. Addig is, ha bármilyen kérdésed van, keress minket bizalommal!
      </p>

    </td>
  </tr>
`;

const adminEmailContent = (firstName: string, lastName: string, userEmail: string, eventName: string, telephone: string) => `
  <tr>
    <td bgcolor="#ffffff" style="padding:48px;">

      <h2 style="font-family:'Luckiest Guy',cursive;color:#377F76;font-size:26px;margin:0 0 8px;letter-spacing:1px;font-weight:400;">Új túrajelentkezés érkezett</h2>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 32px;">Az alábbi személy regisztrált az egyik túrátokra.</p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:8px;overflow:hidden;">
        <tr>
          <td bgcolor="#377F76" style="padding:12px 20px;">
            <span style="font-family:'Source Sans 3',Arial,sans-serif;color:#ffffff;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Jelentkező adatai</span>
          </td>
        </tr>
        <tr>
          <td bgcolor="#F1E8D9" style="padding:14px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="35%" style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;padding-right:12px;">Név</td>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:16px;">${lastName} ${firstName}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td bgcolor="#ffffff" style="padding:14px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="35%" style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;padding-right:12px;">Email</td>
                <td><a href="mailto:${userEmail}" style="font-family:'Source Sans 3',Arial,sans-serif;color:#377F76;font-size:16px;text-decoration:none;">${userEmail}</a></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td bgcolor="#F1E8D9" style="padding:14px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="35%" style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;padding-right:12px;">Telefonszám</td>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:16px;">${telephone}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td bgcolor="#ffffff" style="padding:14px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="35%" style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;padding-right:12px;">Túra</td>
                <td style="font-family:'Luckiest Guy',cursive;color:#377F76;font-size:18px;letter-spacing:1px;font-weight:400;">${eventName}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

    </td>
  </tr>
`;

export const sendSignupEmails = async (signupData: {
  userEmail: string;
  firstName: string;
  lastName: string;
  eventName: string;
  telephone: string;
}) => {
  // Ensure transporter is set up
  if (!transporter) {
    await setupTransporter();
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const siteUrl = process.env.SITE_URL;

  const { userEmail, firstName, lastName, eventName, telephone } = signupData;

  // Email to the user (confirmation)
  await transporter.sendMail({
    from: `"Gyertek velünk" <${process.env.SMTP_USER}>`,
    to: userEmail,
    subject: `Sikeres túrajelentkezés – ${eventName}`,
    html: emailWrapper(
      siteUrl,
      userEmailContent(firstName, lastName, eventName)
    ),
  });

  // Email to admin (notification)
  await transporter.sendMail({
    from: `"Gyertek velünk Túrajelentkezés" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `Túrajelentkezés: ${eventName}`,
    html: emailWrapper(
      siteUrl,
      adminEmailContent(firstName, lastName, userEmail, eventName, telephone)
    ),
  });
};
