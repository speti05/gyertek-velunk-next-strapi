export const userEmailContent = (firstName: string, lastName: string, eventName: string) => `
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
        A jelentkezésedet megkaptuk, a foglalásod az előleg beérkezése után válik véglegessé. Az utaláshoz szükséges adatokat lent találod:
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:8px;overflow:hidden;border-left:4px solid #4FB6A9;margin-bottom:28px;">
        <tr>
          <td bgcolor="#F1E8D9" style="padding:20px 24px;">
            <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin:0 0 10px;">Utalási adatok</p>
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:14px;font-weight:600;padding:3px 12px 3px 0;white-space:nowrap;">Kedvezményezett:</td>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:14px;padding:3px 0;">Gyertek velünk</td>
              </tr>
              <tr>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:14px;font-weight:600;padding:3px 12px 3px 0;white-space:nowrap;">Bankszámlaszám:</td>
                <td style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:14px;padding:3px 0;">1177334601362103</td>
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
        Ha bármi kérdésed van, nyugodtan írj nekünk az <a href="mailto:info@gyertekvelunk.eu" style="color:#377F76;text-decoration:none;">info@gyertekvelunk.eu</a> email címre.
      </p>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 8px;">
        Hamarosan találkozunk! ⛰️
      </p>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0;">
        Üdvözlettel,<br>
        <strong>A Gyertek Velünk csapata</strong>
      </p>

    </td>
  </tr>
`;

export const adminEmailContent = (
  firstName: string,
  lastName: string,
  userEmail: string,
  eventName: string,
  telephone: string
) => `
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
