import type { StrapiTexts } from "../../../i18n/get-strapi-texts";

export const emailHeader = (subject: string, t: StrapiTexts) => `
  <tr>
    <td style="padding:0;line-height:0;font-size:0;">
      <img src="cid:email-fejlec" width="600"
           style="display:block;width:100%;height:auto;border:0;"
           alt="${t.EMAIL_HEADER_LOGO_ALT}" />
    </td>
  </tr>
  <tr>
    <td bgcolor="#578C84" style="padding:16px 40px;">
      <h1 style="font-family:'Source Sans 3',Arial,sans-serif;color:#ffffff;margin:0;font-size:22px;font-weight:600;letter-spacing:0.5px;">${subject}</h1>
    </td>
  </tr>
`;

export const emailFooter = (
  siteUrl: string | undefined,
  year: number,
  t: StrapiTexts,
  organizationName?: string
) => `
  <tr>
    <td bgcolor="#70634C" style="padding:28px 40px;text-align:center;">
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#F1E8D9;font-size:14px;margin:0 0 6px;line-height:1.6;">
        &copy; ${year} ${organizationName} &mdash; ${t.EMAIL_FOOTER_RIGHTS}
      </p>
      ${siteUrl ? `<a href="${siteUrl}" style="font-family:'Source Sans 3',Arial,sans-serif;color:#B0DFD8;font-size:14px;text-decoration:none;">${siteUrl}</a>` : ""}
    </td>
  </tr>
`;

export const emailWrapper = (
  siteUrl: string | undefined,
  content: string,
  subject: string,
  t: StrapiTexts,
  organizationName?: string
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
          ${emailHeader(subject, t)}
          ${content}
          ${emailFooter(siteUrl, year, t, organizationName)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

/**
 * Separates the Hungarian and English halves of a bilingual system e-mail. Rendered as a
 * table row so it sits between two content rows of the same outer table.
 */
export const bilingualDivider = () => `
  <tr>
    <td bgcolor="#ffffff" style="padding:0 48px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="border-top:1px solid #E4CBA1;line-height:0;font-size:0;">&nbsp;</td>
        </tr>
      </table>
    </td>
  </tr>
`;
