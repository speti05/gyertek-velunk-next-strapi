import type { SocialsProps } from "@/types";
import { getGlobalSettings } from "@/data/loaders";
import { FacebookEmbed } from "@/components/blocks/socials/FacebookEmbed";
import { InstagramEmbed } from "@/components/blocks/socials/InstagramEmbed";
import { YoutubeChannelEmbed } from "@/components/blocks/socials/YoutubeChannelEmbed";
import { TiktokEmbed } from "@/components/blocks/socials/TiktokEmbed";

export async function Socials({ text, isTopMarginReseted = false }: Readonly<SocialsProps>) {
  const { data } = await getGlobalSettings();
  const { facebookUrl, instagramUrl, tiktokUrl, youtubeUrl } = data?.footer ?? {};

  if (!facebookUrl && !instagramUrl && !tiktokUrl && !youtubeUrl) return null;

  return (
    <div
      className={`socials-block${isTopMarginReseted ? " socials-block--top-margin-reset" : ""}`}
    >
      <h3 className="socials-block__title">{text}</h3>
      <div className="socials-block__grid">
        {facebookUrl && <FacebookEmbed url={facebookUrl} />}
        {instagramUrl && <InstagramEmbed url={instagramUrl} />}
        {youtubeUrl && <YoutubeChannelEmbed url={youtubeUrl} />}
        {tiktokUrl && <TiktokEmbed url={tiktokUrl} />}
      </div>
    </div>
  );
}
