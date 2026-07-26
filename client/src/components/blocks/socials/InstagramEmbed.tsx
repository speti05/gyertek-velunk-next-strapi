"use client";

import { FOOTER_INSTAGRAM_ARIA, SOCIALS_EMBED_LOAD_ERROR, SOCIALS_INSTAGRAM_LABEL } from "@/utils/texts";
import { SocialBoxTitle } from "@/components/blocks/socials/SocialBoxTitle";
import { SocialEmbedLoader } from "@/components/blocks/socials/SocialEmbedLoader";
import { CustomAlertMessage } from "@/components/custom-ui-components/custom-alert/custom-alert-message";
import { useSocialEmbedTimeout } from "@/components/blocks/socials/useSocialEmbedTimeout";

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
  const { hasFailed, markLoaded } = useSocialEmbedTimeout();

  if (!username) return null;

  return (
    <div className="socials-block__item socials-block__item--instagram">
      <SocialBoxTitle url={url} iconName="instagram" label={SOCIALS_INSTAGRAM_LABEL} />
      <div className="socials-block__item-content">
        {hasFailed ? (
          <CustomAlertMessage warningMessage={SOCIALS_EMBED_LOAD_ERROR} />
        ) : (
          <>
            <SocialEmbedLoader />
            <iframe
              src={`https://www.instagram.com/${username}/embed`}
              title={FOOTER_INSTAGRAM_ARIA}
              loading="lazy"
              scrolling="no"
              onLoad={markLoaded}
            />
          </>
        )}
      </div>
    </div>
  );
}
