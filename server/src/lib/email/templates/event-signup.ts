export const userEmailContent = (
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
    totalPrice > 0 ? `${totalPrice.toLocaleString("hu-HU")} ${currency ?? "Pénzegység"}` : null;
  return `
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

      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:32px 0 16px;">
        Örülünk, hogy velünk tartasz.
      </p>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 20px;">
        A jelentkezésedet megkaptuk, a foglalásod az előleg beérkezése után válik véglegessé. Ajelentkezési részleteket megtalálod a profilodban.Az utaláshoz szükséges adatokat lent találod:
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:8px;overflow:hidden;border-left:4px solid #4FB6A9;margin-bottom:28px;">
        <tr>
          <td bgcolor="#F1E8D9" style="padding:20px 24px;">
            <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin:0 0 10px;">Utalási adatok</p>
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              ${
                totalPriceFormatted
                  ? `<tr>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:14px;font-weight:600;padding:3px 12px 3px 0;white-space:nowrap;">Fizetendő összeg:</td>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:14px;font-weight:700;padding:3px 0;">${totalPriceFormatted}</td>
              </tr>`
                  : ""
              }
              <tr>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:14px;font-weight:600;padding:3px 12px 3px 0;white-space:nowrap;">Kedvezményezett:</td>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:14px;padding:3px 0;">${bankBeneficiaryName}</td>
              </tr>
              <tr>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:14px;font-weight:600;padding:3px 12px 3px 0;white-space:nowrap;">Bankszámlaszám:</td>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:14px;padding:3px 0;">${bankAccountNumber}</td>
              </tr>
              <tr>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:14px;font-weight:600;padding:3px 12px 3px 0;white-space:nowrap;">Közlemény:</td>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:14px;padding:3px 0;">${eventName} + ${lastName} ${firstName}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 16px;">
        A következő időszakban ezeken fogunk együtt végigmenni:
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr>
          <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:15px;line-height:24px;padding:6px 0 6px 8px;vertical-align:top;">
            <span style="color:#377F76;font-weight:700;margin-right:8px;">•</span>Az utalásod beérkezése után telefonon is felvesszük veled a kapcsolatot, ahol megbeszéljük a további kommunikáció részleteit. Facebookon is felvesszük egymást, illetve bekerülsz a közös Messenger csoportba is.
          </td>
        </tr>
        <tr>
          <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:15px;line-height:24px;padding:6px 0 6px 8px;vertical-align:top;">
            <span style="color:#377F76;font-weight:700;margin-right:8px;">•</span>Ezt követően elküldjük neked a túra részletesebb leírását és a szükséges felszereléslistát. Ez még nem a végleges tájékoztató, a célja inkább az, hogy időben képbe kerülj a túrával kapcsolatban és nyugodtan fel tudj készülni.
          </td>
        </tr>
        <tr>
          <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:15px;line-height:24px;padding:6px 0 6px 8px;vertical-align:top;">
            <span style="color:#377F76;font-weight:700;margin-right:8px;">•</span>Az egyik legfontosabb lépés a repülőjegy lefoglalása. Ezt alapvetően minden résztvevő önállóan intézi, azonban igény esetén felár ellenében természetesen segítünk a foglalásban is.
          </td>
        </tr>
        <tr>
          <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:15px;line-height:24px;padding:6px 0 6px 8px;vertical-align:top;">
            <span style="color:#377F76;font-weight:700;margin-right:8px;">•</span>Utasbiztosítás megkötése kötelező, melynek meglétét indulás előtt ellenőrizzük. Amennyiben szeretnéd, felár ellenében ebben is tudunk segíteni.
          </td>
        </tr>
        <tr>
          <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:15px;line-height:24px;padding:6px 0 6px 8px;vertical-align:top;">
            <span style="color:#377F76;font-weight:700;margin-right:8px;">•</span>Körülbelül egy hónappal az indulás előtt megküldjük a végleges tájékoztatót, a pontos menetrendet és minden fontos indulási információt.
          </td>
        </tr>
      </table>

      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 20px;">
        Ha bármi kérdésed van, nyugodtan írj nekünk az <a href="mailto:${contactEmail}" style="color:#377F76;text-decoration:none;">${contactEmail}</a> email címre.
      </p>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 8px;">
        Hamarosan találkozunk! ⛰️
      </p>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0;">
        Üdvözlettel,<br>
        <strong>A ${organizationName} csapata</strong>
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

export const adminEmailContent = ({
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
}) => {
  const billingAddress = [billingZip, billingCity, billingStreet, billingHouseNumber]
    .filter(Boolean)
    .join(" ");

  const fbLinkHtml = (link: string) =>
    `<a href="${link}" style="color:#377F76;text-decoration:none;" target="_blank">${link}</a>`;

  const companionsSections = (companions ?? [])
    .map((c, idx) => {
      const companionRows = [
        row("Név", `${c.lastName} ${c.firstName}`, "#F1E8D9"),
        row("Telefonszám", c.phone, "#ffffff"),
        row("Születési ország", c.birthCountry, "#F1E8D9"),
        row("Születési hely", c.birthPlace, "#ffffff"),
        row("Születési dátum", c.birthDate, "#F1E8D9"),
        row("Okmány típusa", c.documentType, "#ffffff"),
        row("Okmány száma", c.documentNumber, "#F1E8D9"),
        row("Kiállítás dátuma", c.documentIssueDate, "#ffffff"),
        row("Lejárat dátuma", c.documentExpiryDate, "#F1E8D9"),
        row("Allergiák / egészségügyi info", c.allergies || undefined, "#ffffff"),
        row("Facebook profil", c.fbLink ? fbLinkHtml(c.fbLink) : undefined, "#F1E8D9"),
      ].join("");
      return section(`${idx + 1}. kísérő adatai`, companionRows);
    })
    .join("");

  const turaSection = section(
    "Túra",
    [
      row(
        "Túra neve",
        `<strong style="font-family:'Luckiest Guy',cursive;color:#377F76;font-size:18px;letter-spacing:1px;font-weight:400;">${eventName}</strong>`,
        "#F1E8D9"
      ),
    ].join("")
  );

  const jelentkezoSection = section(
    "Jelentkező adatai",
    [
      row("Név", `${lastName} ${firstName}`, "#F1E8D9"),
      row(
        "Email",
        `<a href="mailto:${userEmail}" style="color:#377F76;text-decoration:none;">${userEmail}</a>`,
        "#ffffff"
      ),
      row("Telefonszám", telephone, "#F1E8D9"),
      row("Számlázási cím (ország)", billingCountry, "#ffffff"),
      row("Számlázási cím", billingAddress || undefined, "#F1E8D9"),
    ].join("")
  );

  const szamlazasSection = section(
    "Számlázás",
    [
      row("Kér számlát", wantInvoice ? "Igen" : "Nem", "#F1E8D9"),
      ...(wantInvoice
        ? [
            row("Cégnév", companyName, "#ffffff"),
            row("Adószám", formatTaxNumber(taxNumber), "#F1E8D9"),
          ]
        : []),
    ].join("")
  );

  const utazasiSection = section(
    "Utazási adatok",
    [
      row("Születési ország", birthCountry, "#F1E8D9"),
      row("Születési hely", birthPlace, "#ffffff"),
      row("Születési dátum", birthDate, "#F1E8D9"),
      row("Okmány típusa", documentType, "#ffffff"),
      row("Okmány száma", documentNumber, "#F1E8D9"),
      row("Kiállítás dátuma", documentIssueDate, "#ffffff"),
      row("Lejárat dátuma", documentExpiryDate, "#F1E8D9"),
      row("Allergiák / egészségügyi info", allergies || undefined, "#ffffff"),
      row("Facebook profil", fbLink ? fbLinkHtml(fbLink) : undefined, "#F1E8D9"),
    ].join("")
  );

  const megjegyzesSection = notes ? section("Megjegyzés", row("Megjegyzés", notes, "#F1E8D9")) : "";

  return `
  <tr>
    <td bgcolor="#ffffff" style="padding:48px;">

      <h2 style="font-family:'Luckiest Guy',cursive;color:#377F76;font-size:26px;margin:0 0 8px;letter-spacing:1px;font-weight:400;">Új túrajelentkezés érkezett</h2>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 24px;">Az alábbi személy regisztrált az egyik túrátokra.</p>

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
