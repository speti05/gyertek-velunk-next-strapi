import {
  CONTACT_PREFERENCE_EMAIL_LABEL,
  CONTACT_PREFERENCE_EMAIL_SENTENCE,
  CONTACT_PREFERENCE_PHONE_LABEL,
  CONTACT_PREFERENCE_PHONE_SENTENCE,
  CONTACT_REQUEST_ADMIN_INTRO,
  CONTACT_REQUEST_ADMIN_PREFERENCE_LABEL,
  CONTACT_REQUEST_ADMIN_SECTION_TITLE,
  CONTACT_REQUEST_ADMIN_TITLE,
  CONTACT_REQUEST_USER_BADGE,
  CONTACT_REQUEST_USER_INTRO,
  CONTACT_REQUEST_USER_OUTRO,
  CONTACT_REQUEST_USER_PREFERENCE_LABEL,
  CONTACT_REQUEST_USER_TITLE,
  EMAIL_GREETING,
  EMAIL_SIGNATURE_CLOSING,
  LABEL_EMAIL_ADDRESS,
  LABEL_NAME,
  LABEL_PHONE,
} from "../../../utils/texts";

const preferredContactLabel = (preferredContact: string) =>
  preferredContact === "phone" ? CONTACT_PREFERENCE_PHONE_LABEL : CONTACT_PREFERENCE_EMAIL_LABEL;

export const adminContactRequestEmailContent = (
  name: string,
  phone: string | null,
  email: string | null,
  preferredContact: string
) => `
  <tr>
    <td bgcolor="#ffffff" style="padding:48px;">

      <h2 style="font-family:'Source Sans 3',Arial,sans-serif;color:#377F76;font-size:26px;margin:0 0 8px;letter-spacing:1px;font-weight:400;">${CONTACT_REQUEST_ADMIN_TITLE}</h2>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 32px;">${CONTACT_REQUEST_ADMIN_INTRO}</p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:8px;overflow:hidden;">
        <tr>
          <td bgcolor="#377F76" style="padding:12px 20px;">
            <span style="font-family:'Source Sans 3',Arial,sans-serif;color:#ffffff;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">${CONTACT_REQUEST_ADMIN_SECTION_TITLE}</span>
          </td>
        </tr>
        <tr>
          <td bgcolor="#F1E8D9" style="padding:14px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="40%" style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;padding-right:12px;">${LABEL_NAME}</td>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:16px;">${name}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td bgcolor="#ffffff" style="padding:14px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="40%" style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;padding-right:12px;">${CONTACT_REQUEST_ADMIN_PREFERENCE_LABEL}</td>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:16px;">${preferredContactLabel(preferredContact)}</td>
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
                <td width="40%" style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;padding-right:12px;">${LABEL_PHONE}</td>
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
                <td width="40%" style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;padding-right:12px;">${LABEL_EMAIL_ADDRESS}</td>
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

const preferredContactSentence = (preferredContact: string) =>
  preferredContact === "phone"
    ? CONTACT_PREFERENCE_PHONE_SENTENCE
    : CONTACT_PREFERENCE_EMAIL_SENTENCE;

export const userContactRequestEmailContent = (
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
                  <span style="font-family:'Source Sans 3',Arial,sans-serif;color:#377F76;font-weight:600;font-size:13px;letter-spacing:1px;text-transform:uppercase;">&#10003; ${CONTACT_REQUEST_USER_BADGE}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <h2 style="font-family:'Source Sans 3',Arial,sans-serif;color:#377F76;font-size:26px;margin:0 0 20px;text-align:center;letter-spacing:1px;font-weight:400;">${CONTACT_REQUEST_USER_TITLE}</h2>

      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:16px;line-height:26px;margin:0 0 12px;">
        ${EMAIL_GREETING(`<strong>${name}</strong>`)}
      </p>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 32px;">
        ${CONTACT_REQUEST_USER_INTRO(preferredContactSentence(preferredContact))}
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:8px;overflow:hidden;border-left:4px solid #4FB6A9;">
        <tr>
          <td bgcolor="#F1E8D9" style="padding:20px 24px;">
            <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin:0 0 6px;">${CONTACT_REQUEST_USER_PREFERENCE_LABEL}</p>
            <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:18px;margin:0 0 4px;font-weight:600;">${preferredContactLabel(preferredContact)}</p>
            <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;margin:0;">${contactValue}</p>
          </td>
        </tr>
      </table>

      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:32px 0 0;">
        ${CONTACT_REQUEST_USER_OUTRO}
      </p>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:20px 0 0;">
        ${EMAIL_SIGNATURE_CLOSING}<br />
        <strong>${organizationName ?? ""}</strong>
      </p>

    </td>
  </tr>
`;
