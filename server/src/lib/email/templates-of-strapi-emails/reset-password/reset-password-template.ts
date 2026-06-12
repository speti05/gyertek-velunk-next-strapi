import { writeFileSync } from "fs";
import { emailHeader, emailFooter, SystemEmailSubject } from "../../templates/layout";

const SITE_URL = process.env.SITE_URL || "https://gyertekvelunk.eu";

const content = `
  <tr>
    <td bgcolor="#ffffff" style="padding:48px 48px 40px;">
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:16px;line-height:26px;margin:0 0 12px;">
        Kedves <strong><%= USER.username %></strong>,
      </p>
      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 32px;">
        Új jelszót igényeltél az oldalunkon. Az alábbi gombra kattintva megadhatod az új
        használni kívánt jelszavadat. De ezt most már el ne hagyd&nbsp;:)
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" style="padding-bottom:32px;">
            <a href="<%= URL %>?code=<%= TOKEN %>"
               style="display:inline-block;font-family:'Source Sans 3',Arial,sans-serif;font-size:16px;font-weight:600;color:#ffffff;background-color:#377F76;text-decoration:none;padding:14px 36px;border-radius:8px;letter-spacing:0.5px;">
              Jelszó visszaállítása
            </a>
          </td>
        </tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" border="0"
             style="border-radius:8px;overflow:hidden;border-left:4px solid #4FB6A9;">
        <tr>
          <td bgcolor="#F1E8D9" style="padding:16px 20px;">
            <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 6px;">
              Ha a gomb nem működik, másold be ezt a linket:
            </p>
            <a href="<%= URL %>?code=<%= TOKEN %>"
               style="font-family:'Source Sans 3',Arial,sans-serif;color:#377F76;font-size:13px;word-break:break-all;text-decoration:none;">
              <%= URL %>?code=<%= TOKEN %>
            </a>
          </td>
        </tr>
      </table>

      <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#888888;font-size:14px;line-height:22px;margin:32px 0 0;">
        Ha nem te kérted a jelszó visszaállítását, kérjük jelezd felénk mielőbb!
      </p>
    </td>
  </tr>
`;

const year = new Date().getFullYear();

const html = `<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;600&display=swap');
  </style>
</head>
<body style="margin:0;padding:0;font-family:'Source Sans 3',Arial,sans-serif;background-color:#F1E8D9;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F1E8D9">
    <tr>
      <td align="center" style="padding:30px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.12);">
          ${emailHeader(SystemEmailSubject.ForgotPassword)}
          ${content}
          ${emailFooter(SITE_URL, year)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const outputPath = process.argv[2];
if (!outputPath) {
  console.error("Usage: ts-node reset-password-template.ts <output.html>");
  process.exit(1);
}
writeFileSync(outputPath, html, "utf-8");
console.log(`Written to: ${outputPath}`);
