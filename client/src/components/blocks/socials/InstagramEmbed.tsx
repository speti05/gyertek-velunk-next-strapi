import { FOOTER_INSTAGRAM_ARIA, SOCIALS_INSTAGRAM_LABEL } from "@/utils/texts";
import { SocialBoxTitle } from "@/components/blocks/socials/SocialBoxTitle";

function getInstagramUsername(url: string): string | null {
  try {
    const { pathname } = new URL(url);
    return pathname.split("/").filter(Boolean)[0] ?? null;
  } catch {
    return null;
  }
}

export function InstagramEmbed({ url }: Readonly<{ url: string }>) {
  const username = getInstagramUsername(url);
  if (!username) return null;

  return (
    <div className="socials-block__item socials-block__item--instagram">
      <SocialBoxTitle url={url} iconName="instagram" label={SOCIALS_INSTAGRAM_LABEL} />
      <div className="socials-block__item-content">
        <iframe
          src={`https://www.instagram.com/${username}/embed`}
          title={FOOTER_INSTAGRAM_ARIA}
          loading="lazy"
          scrolling="no"
        />
      </div>
    </div>
  );
}
