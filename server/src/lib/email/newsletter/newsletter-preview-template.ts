import { writeFileSync } from "fs";
import { newsletterEmailWrapper } from "../templates/newsletter";

const PREVIEW_SUBJECT = "Minta hírlevél cím";
const PREVIEW_UNSUBSCRIBE_URL = "https://gyertekvelunk.eu/leiratkozas?token=PREVIEW";

const PREVIEW_CONTENT = `
  <h2 style="font-family:'Source Sans 3',Arial,sans-serif;color:#377F76;font-size:22px;margin:0 0 16px;font-weight:600;">
    Ez egy minta bekezdéscím
  </h2>
  <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:16px;line-height:26px;margin:0 0 16px;">
    Ide kerül a hírlevél törzsszövege. Lehet több bekezdés, kép, link stb.
    Ez csak egy előnézeti sablon, hogy látszódjon az email kinézete.
  </p>
  <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0 0 16px;">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
  </p>
  <p style="font-family:'Source Sans 3',Arial,sans-serif;color:#555555;font-size:16px;line-height:26px;margin:0;">
    Üdvözlettel,<br/>
    <strong>Gyertek velünk csapata</strong>
  </p>
`;

const html = newsletterEmailWrapper(PREVIEW_SUBJECT, PREVIEW_CONTENT, PREVIEW_UNSUBSCRIBE_URL);

const outputPath = process.argv[2];
if (!outputPath) {
  console.error("Usage: ts-node newsletter-preview-template.ts <output.html>");
  process.exit(1);
}
writeFileSync(outputPath, html, "utf-8");
console.log(`Written to: ${outputPath}`);
