export const userEmailContent = (subscriberEmail: string) => `
  <tr>
    <td bgcolor="#ffffff" style="padding:48px 48px 40px;">
      <h2 style="font-family:'Source Sans 3',Arial,sans-serif;color:#377F76;font-size:26px;margin:0 0 24px;letter-spacing:1px;font-weight:400;">
        Sikeresen feliratkoztál!
      </h2>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:16px;line-height:26px;margin:0 0 12px;">
        Kedves <strong>${subscriberEmail}</strong>,
      </p>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 32px;">
        Örömmel értesítünk, hogy sikeresen feliratkoztál a <strong>Gyertek velünk</strong> hírlevelére!
        Hamarosan értesítünk a legújabb túráinkról, eseményeinkről és híreinkről&nbsp;:)
      </p>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#888888;font-size:14px;line-height:22px;margin:0;">
        Ha nem te iratkoztál fel erre az email címre, hagyd figyelmen kívül ezt az üzenetet.
      </p>
    </td>
  </tr>
`;

export const adminEmailContent = (subscriberEmail: string) => `
  <tr>
    <td bgcolor="#ffffff" style="padding:48px;">

      <h2 style="font-family:'Luckiest Guy',cursive;color:#377F76;font-size:26px;margin:0 0 8px;letter-spacing:1px;font-weight:400;">Új hírlevél feliratkozás</h2>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 32px;">Az alábbi email cím feliratkozott a hírlevélre.</p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:8px;overflow:hidden;">
        <tr>
          <td bgcolor="#377F76" style="padding:12px 20px;">
            <span style="font-family:'Source Sans 3',Arial,sans-serif;color:#ffffff;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Feliratkozó adatai</span>
          </td>
        </tr>
        <tr>
          <td bgcolor="#F1E8D9" style="padding:14px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="35%" style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;padding-right:12px;">Email</td>
                <td><a href="mailto:${subscriberEmail}" style="font-family:'Source Sans 3',Arial,sans-serif;color:#377F76;font-size:16px;text-decoration:none;">${subscriberEmail}</a></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

    </td>
  </tr>
`;
