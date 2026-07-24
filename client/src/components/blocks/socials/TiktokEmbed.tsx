"use client";

import { useEffect } from "react";
import { FOOTER_TIKTOK_ARIA, SOCIALS_TIKTOK_LABEL } from "@/utils/texts";
import { SocialBoxTitle } from "@/components/blocks/socials/SocialBoxTitle";
import { SocialEmbedLoader } from "@/components/blocks/socials/SocialEmbedLoader";

declare global {
  interface Window {
    tiktokEmbed?: { lib?: { render?: (elements?: HTMLElement[]) => void } };
  }
}

const TIKTOK_EMBED_SCRIPT_SRC = "https://www.tiktok.com/embed.js";

function getTiktokUsername(url: string): string | null {
  try {
    const { pathname } = new URL(url);
    const segment = pathname.split("/").filter(Boolean)[0];
    return segment?.startsWith("@") ? segment.slice(1) : null;
  } catch {
    return null;
  }
}

export function TiktokEmbed({ url }: Readonly<{ url: string }>) {
  const username = getTiktokUsername(url);

  useEffect(() => {
    if (!username) return;

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${TIKTOK_EMBED_SCRIPT_SRC}"]`
    );

    if (existingScript) {
      window.tiktokEmbed?.lib?.render?.();
      return;
    }

    const script = document.createElement("script");
    script.src = TIKTOK_EMBED_SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, [username]);

  if (!username) return null;

  return (
    <div className="socials-block__item socials-block__item--tiktok" aria-label={FOOTER_TIKTOK_ARIA}>
      <SocialBoxTitle url={url} iconName="tiktok" label={SOCIALS_TIKTOK_LABEL} />
      <div className="socials-block__item-content">
        <SocialEmbedLoader />
        <blockquote className="tiktok-embed" cite={url} data-unique-id={username} data-embed-type="creator">
          <section />
        </blockquote>
      </div>
    </div>
  );
}
