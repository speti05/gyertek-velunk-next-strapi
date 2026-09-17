import type { StrapiTexts } from "../../../i18n/get-strapi-texts";

const preferredContactLabel = (t: StrapiTexts, preferredContact: string) =>
  preferredContact === "phone" ? t.CONTACT_PREFERENCE_PHONE_LABEL : t.CONTACT_PREFERENCE_EMAIL_LABEL;

export const adminContactRequestEmailContent = (
  t: StrapiTexts,
  name: string,
  phone: string | null,
  email: string | null,
  preferredContact: string
) => `
  <tr>
    <td bgcolor="#ffffff" style="padding:48px;">

      <h2 style="font-family:'Source Sans 3',Arial,sans-serif;color:#377F76;font-size:26px;margin:0 0 8px;letter-spacing:1px;font-weight:400;">${t.CONTACT_REQUEST_ADMIN_TITLE}</h2>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 32px;">${t.CONTACT_REQUEST_ADMIN_INTRO}</p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:8px;overflow:hidden;">
        <tr>
          <td bgcolor="#377F76" style="padding:12px 20px;">
            <span style="font-family:'Source Sans 3',Arial,sans-serif;color:#ffffff;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">${t.CONTACT_REQUEST_ADMIN_SECTION_TITLE}</span>
          </td>
        </tr>
        <tr>
          <td bgcolor="#F1E8D9" style="padding:14px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="40%" style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;padding-right:12px;">${t.LABEL_NAME}</td>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:16px;">${name}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td bgcolor="#ffffff" style="padding:14px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="40%" style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;padding-right:12px;">${t.CONTACT_REQUEST_ADMIN_PREFERENCE_LABEL}</td>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:16px;">${preferredContactLabel(t, preferredContact)}</td>
              </tr>
            </table>
          </td>
        </tr>
        ${
          phone
            ? `<tr>
          <td bgcolor="#F1E8D9" style="padding:14px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="40%" style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;padding-right:12px;">${t.LABEL_PHONE}</td>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:16px;">${phone}</td>
              </tr>
            </table>
          </td>
        </tr>`
            : ""
        }
        ${
          email
            ? `<tr>
          <td bgcolor="${phone ? "#ffffff" : "#F1E8D9"}" style="padding:14px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="40%" style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;padding-right:12px;">${t.LABEL_EMAIL_ADDRESS}</td>
                <td><a href="mailto:${email}" style="font-family:'Source Sans 3',Arial,sans-serif;color:#377F76;font-size:16px;text-decoration:none;">${email}</a></td>
              </tr>
            </table>
          </td>
        </tr>`
            : ""
        }
      </table>

    </td>
  </tr>
`;

const preferredContactSentence = (t: StrapiTexts, preferredContact: string) =>
  preferredContact === "phone"
    ? t.CONTACT_PREFERENCE_PHONE_SENTENCE
    : t.CONTACT_PREFERENCE_EMAIL_SENTENCE;

export const userContactRequestEmailContent = (
  t: StrapiTexts,
  name: string,
  preferredContact: string,
  contactValue: string,
  organizationName?: string
) => `
  <tr>
    <td bgcolor="#ffffff" style="padding:48px 48px 40px;">

      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" style="padding-bottom:28px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td bgcolor="#B0DFD8" style="border-radius:50px;padding:8px 24px;">
                  <span style="font-family:'Source Sans 3',Arial,sans-serif;color:#377F76;font-weight:600;font-size:13px;letter-spacing:1px;text-transform:uppercase;">&#10003; ${t.CONTACT_REQUEST_USER_BADGE}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <h2 style="font-family:'Source Sans 3',Arial,sans-serif;color:#377F76;font-size:26px;margin:0 0 20px;text-align:center;letter-spacing:1px;font-weight:400;">${t.CONTACT_REQUEST_USER_TITLE}</h2>

      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:16px;line-height:26px;margin:0 0 12px;">
        ${t.EMAIL_GREETING(`<strong>${name}</strong>`)}
      </p>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 32px;">
        ${t.CONTACT_REQUEST_USER_INTRO(preferredContactSentence(t, preferredContact))}
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:8px;overflow:hidden;border-left:4px solid #4FB6A9;">
        <tr>
          <td bgcolor="#F1E8D9" style="padding:20px 24px;">
            <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin:0 0 6px;">${t.CONTACT_REQUEST_USER_PREFERENCE_LABEL}</p>
            <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:18px;margin:0 0 4px;font-weight:600;">${preferredContactLabel(t, preferredContact)}</p>
            <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;margin:0;">${contactValue}</p>
          </td>
        </tr>
      </table>

      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:32px 0 0;">
        ${t.CONTACT_REQUEST_USER_OUTRO}
      </p>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:20px 0 0;">
        ${t.EMAIL_SIGNATURE_CLOSING}<br />
        <strong>${organizationName ?? ""}</strong>
      </p>

    </td>
  </tr>
`;
