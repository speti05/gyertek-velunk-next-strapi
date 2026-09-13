import {
  EMAIL_GREETING,
  LABEL_EMAIL,
  NEWSLETTER_SIGNUP_ADMIN_INTRO,
  NEWSLETTER_SIGNUP_ADMIN_SECTION_TITLE,
  NEWSLETTER_SIGNUP_ADMIN_TITLE,
  NEWSLETTER_SIGNUP_USER_DISCLAIMER,
  NEWSLETTER_SIGNUP_USER_INTRO,
  NEWSLETTER_SIGNUP_USER_TITLE,
  SITE_NAME,
} from "../../../utils/texts";

export const userEmailContent = (subscriberEmail: string) => `
  <tr>
    <td bgcolor="#ffffff" style="padding:48px 48px 40px;">
      <h2 style="font-family:'Source Sans 3',Arial,sans-serif;color:#377F76;font-size:26px;margin:0 0 24px;letter-spacing:1px;font-weight:400;">
        ${NEWSLETTER_SIGNUP_USER_TITLE}
      </h2>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:16px;line-height:26px;margin:0 0 12px;">
        ${EMAIL_GREETING(`<strong>${subscriberEmail}</strong>`)}
      </p>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 32px;">
        ${NEWSLETTER_SIGNUP_USER_INTRO(`<strong>${SITE_NAME}</strong>`)}
      </p>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#888888;font-size:14px;line-height:22px;margin:0;">
        ${NEWSLETTER_SIGNUP_USER_DISCLAIMER}
      </p>
    </td>
  </tr>
`;

export const adminEmailContent = (subscriberEmail: string) => `
  <tr>
    <td bgcolor="#ffffff" style="padding:48px;">

      <h2 style="font-family:'Source Sans 3',Arial,sans-serif;color:#377F76;font-size:26px;margin:0 0 8px;letter-spacing:1px;font-weight:400;">${NEWSLETTER_SIGNUP_ADMIN_TITLE}</h2>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 32px;">${NEWSLETTER_SIGNUP_ADMIN_INTRO}</p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:8px;overflow:hidden;">
        <tr>
          <td bgcolor="#377F76" style="padding:12px 20px;">
            <span style="font-family:'Source Sans 3',Arial,sans-serif;color:#ffffff;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">${NEWSLETTER_SIGNUP_ADMIN_SECTION_TITLE}</span>
          </td>
        </tr>
        <tr>
          <td bgcolor="#F1E8D9" style="padding:14px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="35%" style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;padding-right:12px;">${LABEL_EMAIL}</td>
                <td><a href="mailto:${subscriberEmail}" style="font-family:'Source Sans 3',Arial,sans-serif;color:#377F76;font-size:16px;text-decoration:none;">${subscriberEmail}</a></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

    </td>
  </tr>
`;
