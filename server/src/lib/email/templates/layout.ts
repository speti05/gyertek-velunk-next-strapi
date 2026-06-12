export enum SystemEmailSubject {
  EmailConfirmation = "Email cím megerősítése",
  ForgotPassword = "Elfelejtett jelszó",
  EventSignup = "Túrajelentkezés megerősítése",
  EventSignupAdmin = "Új túrajelentkezés",
  NewsletterSignup = "Hírlevél feliratkozás",
}

export const emailHeader = (subject: SystemEmailSubject | string) => `
  <tr>
    <td style="padding:0;line-height:0;font-size:0;">
      <img src="cid:email-fejlec" width="600"
           style="display:block;width:100%;height:auto;border:0;"
           alt="Gyertek velünk" />
    </td>
  </tr>
  <tr>
    <td bgcolor="#578C84" style="padding:16px 40px;">
      <h1 style="font-family:'Source Sans 3',Arial,sans-serif;color:#ffffff;margin:0;font-size:22px;font-weight:600;letter-spacing:0.5px;">${subject}</h1>
    </td>
  </tr>
`;

export const emailFooter = (siteUrl: string | undefined, year: number) => `
  <tr>
    <td bgcolor="#70634C" style="padding:28px 40px;text-align:center;">
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#F1E8D9;font-size:14px;margin:0 0 6px;line-height:1.6;">
        &copy; ${year} Gyertek velünk &mdash; Minden jog fenntartva.
      </p>
      ${siteUrl ? `<a href="${siteUrl}" style="font-family:'Source Sans 3',Arial,sans-serif;color:#B0DFD8;font-size:14px;text-decoration:none;">${siteUrl}</a>` : ""}
    </td>
  </tr>
`;

export const emailWrapper = (
  siteUrl: string | undefined,
  content: string,
  subject: SystemEmailSubject | string
) => {
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
          ${emailHeader(subject)}
          ${content}
          ${emailFooter(siteUrl, year)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
