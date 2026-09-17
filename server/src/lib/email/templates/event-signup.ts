import type { StrapiTexts } from "../../../i18n/get-strapi-texts";

export const userEmailContent = (
  t: StrapiTexts,
  firstName: string,
  lastName: string,
  eventName: string,
  price?: string,
  totalTravelers?: number,
  currency?: string,
  bankAccountNumber?: string,
  bankBeneficiaryName?: string,
  contactEmail?: string,
  organizationName?: string
) => {
  const numericPrice = price ? parseFloat(price.replace(/[^0-9.]/g, "")) : 0;
  const travelers = totalTravelers ?? 1;
  const totalPrice = numericPrice * travelers;
  const totalPriceFormatted =
    totalPrice > 0 ? `${totalPrice.toLocaleString("hu-HU")} ${currency ?? t.CURRENCY_FALLBACK}` : null;
  const contactEmailLink = `<a href="mailto:${contactEmail}" style="color:#377F76;text-decoration:none;">${contactEmail}</a>`;
  return `
  <tr>
    <td bgcolor="#ffffff" style="padding:48px 48px 40px;">

      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" style="padding-bottom:28px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td bgcolor="#B0DFD8" style="border-radius:50px;padding:8px 24px;">
                  <span style="font-family:'Source Sans 3',Arial,sans-serif;color:#377F76;font-weight:600;font-size:13px;letter-spacing:1px;text-transform:uppercase;">&#10003; ${t.EVENT_SIGNUP_USER_BADGE}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <h2 style="font-family:'Source Sans 3',Arial,sans-serif;color:#377F76;font-size:26px;margin:0 0 20px;text-align:center;letter-spacing:1px;font-weight:400;">${t.EVENT_SIGNUP_USER_TITLE}</h2>

      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:16px;line-height:26px;margin:0 0 12px;">
        ${t.EMAIL_GREETING(`<strong>${lastName} ${firstName}</strong>`)}
      </p>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 32px;">
        ${t.EVENT_SIGNUP_USER_INTRO}
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:8px;overflow:hidden;border-left:4px solid #4FB6A9;">
        <tr>
          <td bgcolor="#F1E8D9" style="padding:20px 24px;">
            <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin:0 0 6px;">${t.EVENT_SIGNUP_SELECTED_TOUR_LABEL}</p>
            <p style="font-family:'Luckiest Guy',cursive;color:#377F76;font-size:22px;margin:0;letter-spacing:1px;font-weight:400;">${eventName}</p>
          </td>
        </tr>
      </table>

      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:32px 0 16px;">
        ${t.EVENT_SIGNUP_USER_GLAD}
      </p>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 20px;">
        ${t.EVENT_SIGNUP_USER_PAYMENT_INTRO}
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:8px;overflow:hidden;border-left:4px solid #4FB6A9;margin-bottom:28px;">
        <tr>
          <td bgcolor="#F1E8D9" style="padding:20px 24px;">
            <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin:0 0 10px;">${t.TRANSFER_SECTION_TITLE}</p>
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              ${
                totalPriceFormatted
                  ? `<tr>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:14px;font-weight:600;padding:3px 12px 3px 0;white-space:nowrap;">${t.TRANSFER_AMOUNT_LABEL}</td>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:14px;font-weight:700;padding:3px 0;">${totalPriceFormatted}</td>
              </tr>`
                  : ""
              }
              <tr>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:14px;font-weight:600;padding:3px 12px 3px 0;white-space:nowrap;">${t.TRANSFER_BENEFICIARY_LABEL}</td>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:14px;padding:3px 0;">${bankBeneficiaryName}</td>
              </tr>
              <tr>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:14px;font-weight:600;padding:3px 12px 3px 0;white-space:nowrap;">${t.TRANSFER_ACCOUNT_NUMBER_LABEL}</td>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:14px;padding:3px 0;">${bankAccountNumber}</td>
              </tr>
              <tr>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:14px;font-weight:600;padding:3px 12px 3px 0;white-space:nowrap;">${t.TRANSFER_REFERENCE_LABEL}</td>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:14px;padding:3px 0;">${eventName} + ${lastName} ${firstName}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 16px;">
        ${t.EVENT_SIGNUP_NEXT_STEPS_TITLE}
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        ${t.EVENT_SIGNUP_NEXT_STEPS.map(
          (step) => `<tr>
          <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:15px;line-height:24px;padding:6px 0 6px 8px;vertical-align:top;">
            <span style="color:#377F76;font-weight:700;margin-right:8px;">•</span>${step}
          </td>
        </tr>`
        ).join("")}
      </table>

      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 20px;">
        ${t.EVENT_SIGNUP_USER_QUESTIONS(contactEmailLink)}
      </p>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 20px;">
        ${t.EVENT_SIGNUP_USER_ATTACHMENT_NOTE(`<strong>${t.EVENT_SIGNUP_CONTRACT_NAME_ACCUSATIVE}</strong>`)}
      </p>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 8px;">
        ${t.EVENT_SIGNUP_USER_SEE_YOU}
      </p>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0;">
        ${t.EMAIL_SIGNATURE_CLOSING}<br>
        <strong>${t.EMAIL_SIGNATURE_TEAM(organizationName)}</strong>
      </p>

    </td>
  </tr>
`;
};

interface CompanionData {
  lastName: string;
  firstName: string;
  phone: string;
  birthCountry: string;
  birthPlace: string;
  birthDate: string;
  documentType: string;
  documentNumber: string;
  documentIssueDate: string;
  documentExpiryDate: string;
  allergies: string;
  fbLink: string;
}

function row(label: string, value: string | undefined, bg: string): string {
  if (!value) return "";
  return `
        <tr>
          <td bgcolor="${bg}" style="padding:14px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="35%" style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;padding-right:12px;">${label}</td>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:16px;">${value}</td>
              </tr>
            </table>
          </td>
        </tr>`;
}

function section(title: string, rows: string): string {
  if (!rows.trim()) return "";
  return `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:8px;overflow:hidden;margin-bottom:24px;">
        <tr>
          <td bgcolor="#377F76" style="padding:12px 20px;">
            <span style="font-family:'Source Sans 3',Arial,sans-serif;color:#ffffff;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">${title}</span>
          </td>
        </tr>
        ${rows}
      </table>`;
}

function formatTaxNumber(digits: string | undefined): string | undefined {
  if (!digits) return undefined;
  const d = digits.replace(/\D/g, "");
  if (d.length < 8) return d;
  if (d.length === 8) return d;
  if (d.length === 9) return `${d.slice(0, 8)}-${d.slice(8)}`;
  return `${d.slice(0, 8)}-${d.slice(8, 9)}-${d.slice(9, 11)}`;
}

export const adminEmailContent = (
  t: StrapiTexts,
  {
  firstName,
  lastName,
  userEmail,
  eventName,
  telephone,
  billingCountry,
  billingCity,
  billingZip,
  billingStreet,
  billingHouseNumber,
  wantInvoice,
  companyName,
  taxNumber,
  birthCountry,
  birthPlace,
  birthDate,
  documentType,
  documentNumber,
  documentIssueDate,
  documentExpiryDate,
  allergies,
  fbLink,
  companions,
  notes,
}: {
  firstName: string;
  lastName: string;
  userEmail: string;
  eventName: string;
  telephone: string;
  billingCountry?: string;
  billingCity?: string;
  billingZip?: string;
  billingStreet?: string;
  billingHouseNumber?: string;
  wantInvoice?: boolean;
  companyName?: string;
  taxNumber?: string;
  birthCountry?: string;
  birthPlace?: string;
  birthDate?: string;
  documentType?: string;
  documentNumber?: string;
  documentIssueDate?: string;
  documentExpiryDate?: string;
  allergies?: string;
  fbLink?: string;
  companions?: CompanionData[];
  notes?: string;
  }
) => {
  const billingAddress = [billingZip, billingCity, billingStreet, billingHouseNumber]
    .filter(Boolean)
    .join(" ");

  const fbLinkHtml = (link: string) =>
    `<a href="${link}" style="color:#377F76;text-decoration:none;" target="_blank">${link}</a>`;

  const companionsSections = (companions ?? [])
    .map((c, idx) => {
      const companionRows = [
        row(t.LABEL_NAME, `${c.lastName} ${c.firstName}`, "#F1E8D9"),
        row(t.LABEL_PHONE, c.phone, "#ffffff"),
        row(t.LABEL_BIRTH_COUNTRY, c.birthCountry, "#F1E8D9"),
        row(t.LABEL_BIRTH_PLACE, c.birthPlace, "#ffffff"),
        row(t.LABEL_BIRTH_DATE, c.birthDate, "#F1E8D9"),
        row(t.LABEL_DOCUMENT_TYPE, c.documentType, "#ffffff"),
        row(t.LABEL_DOCUMENT_NUMBER, c.documentNumber, "#F1E8D9"),
        row(t.LABEL_DOCUMENT_ISSUE_DATE, c.documentIssueDate, "#ffffff"),
        row(t.LABEL_DOCUMENT_EXPIRY_DATE, c.documentExpiryDate, "#F1E8D9"),
        row(t.LABEL_ALLERGIES, c.allergies || undefined, "#ffffff"),
        row(t.LABEL_FACEBOOK_PROFILE, c.fbLink ? fbLinkHtml(c.fbLink) : undefined, "#F1E8D9"),
      ].join("");
      return section(t.EVENT_SIGNUP_COMPANION_SECTION_TITLE(idx + 1), companionRows);
    })
    .join("");

  const turaSection = section(
    t.EVENT_SIGNUP_SECTION_TOUR,
    [
      row(
        t.LABEL_TOUR_NAME,
        `<strong style="font-family:'Luckiest Guy',cursive;color:#377F76;font-size:18px;letter-spacing:1px;font-weight:400;">${eventName}</strong>`,
        "#F1E8D9"
      ),
    ].join("")
  );

  const jelentkezoSection = section(
    t.EVENT_SIGNUP_SECTION_APPLICANT,
    [
      row(t.LABEL_NAME, `${lastName} ${firstName}`, "#F1E8D9"),
      row(
        t.LABEL_EMAIL,
        `<a href="mailto:${userEmail}" style="color:#377F76;text-decoration:none;">${userEmail}</a>`,
        "#ffffff"
      ),
      row(t.LABEL_PHONE, telephone, "#F1E8D9"),
      row(t.LABEL_BILLING_COUNTRY, billingCountry, "#ffffff"),
      row(t.LABEL_BILLING_ADDRESS, billingAddress || undefined, "#F1E8D9"),
    ].join("")
  );

  const szamlazasSection = section(
    t.EVENT_SIGNUP_SECTION_INVOICING,
    [
      row(t.LABEL_WANTS_INVOICE, wantInvoice ? t.LABEL_YES : t.LABEL_NO, "#F1E8D9"),
      ...(wantInvoice
        ? [
            row(t.LABEL_COMPANY_NAME, companyName, "#ffffff"),
            row(t.LABEL_TAX_NUMBER, formatTaxNumber(taxNumber), "#F1E8D9"),
          ]
        : []),
    ].join("")
  );

  const utazasiSection = section(
    t.EVENT_SIGNUP_SECTION_TRAVEL_DATA,
    [
      row(t.LABEL_BIRTH_COUNTRY, birthCountry, "#F1E8D9"),
      row(t.LABEL_BIRTH_PLACE, birthPlace, "#ffffff"),
      row(t.LABEL_BIRTH_DATE, birthDate, "#F1E8D9"),
      row(t.LABEL_DOCUMENT_TYPE, documentType, "#ffffff"),
      row(t.LABEL_DOCUMENT_NUMBER, documentNumber, "#F1E8D9"),
      row(t.LABEL_DOCUMENT_ISSUE_DATE, documentIssueDate, "#ffffff"),
      row(t.LABEL_DOCUMENT_EXPIRY_DATE, documentExpiryDate, "#F1E8D9"),
      row(t.LABEL_ALLERGIES, allergies || undefined, "#ffffff"),
      row(t.LABEL_FACEBOOK_PROFILE, fbLink ? fbLinkHtml(fbLink) : undefined, "#F1E8D9"),
    ].join("")
  );

  const megjegyzesSection = notes
    ? section(t.EVENT_SIGNUP_SECTION_NOTES, row(t.LABEL_NOTES, notes, "#F1E8D9"))
    : "";

  return `
  <tr>
    <td bgcolor="#ffffff" style="padding:48px;">

      <h2 style="font-family:'Source Sans 3',Arial,sans-serif;color:#377F76;font-size:26px;margin:0 0 8px;letter-spacing:1px;font-weight:400;">${t.EVENT_SIGNUP_ADMIN_TITLE}</h2>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 24px;">${t.EVENT_SIGNUP_ADMIN_INTRO}</p>

      ${turaSection}

      ${jelentkezoSection}

      ${szamlazasSection}

      ${utazasiSection}

      ${companionsSections}

      ${megjegyzesSection}

    </td>
  </tr>
`;
};
