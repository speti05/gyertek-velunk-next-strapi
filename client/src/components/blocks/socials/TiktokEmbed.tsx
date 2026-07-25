"use client";

import { useEffect, useRef, useState } from "react";
import { FOOTER_TIKTOK_ARIA, SOCIALS_TIKTOK_LABEL } from "@/utils/texts";
import CustomLink from "@/components/custom-ui-components/custom-link/custom-link";
import CustomIcon from "@/components/custom-ui-components/custom-icon/custom-icon";
import { SocialBoxTitle } from "@/components/blocks/socials/SocialBoxTitle";
import { SocialEmbedLoader } from "@/components/blocks/socials/SocialEmbedLoader";

declare global {
  interface Window {
    tiktokEmbed?: { lib?: { render?: (elements?: HTMLElement[]) => void } };
  }
}

const TIKTOK_EMBED_SCRIPT_SRC = "https://www.tiktok.com/embed.js";
const TIKTOK_EMBED_TIMEOUT_MS = 8000;

function getTiktokUsername(url: string): string | null {
  try {
    const { pathname } = new URL(url);
    const segment = pathname.split("/").filter(Boolean)[0];
    return segment?.startsWith("@") ? segment.slice(1) : null;
  } catch {
    return null;
  }
}

function loadTiktokEmbedScript(): Promise<void> {
  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[src="${TIKTOK_EMBED_SCRIPT_SRC}"]`
  );

  if (existingScript) {
    if (window.tiktokEmbed?.lib?.render) return Promise.resolve();
    return new Promise((resolve) =>
      existingScript.addEventListener("load", () => resolve(), { once: true })
    );
  }

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = TIKTOK_EMBED_SCRIPT_SRC;
    script.async = true;
    script.addEventListener("load", () => resolve(), { once: true });
    document.body.appendChild(script);
  });
}

function TiktokLinkFallback({ url }: Readonly<{ url: string }>) {
  return (
    <div className="socials-block__item socials-block__item--tiktok socials-block__item--link">
      <SocialBoxTitle url={url} iconName="tiktok" label={SOCIALS_TIKTOK_LABEL} />
      <div className="socials-block__item-content">
        <CustomLink
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={FOOTER_TIKTOK_ARIA}
          underline="none"
        >
          <CustomIcon name="tiktok" size="3x" />
        </CustomLink>
      </div>
    </div>
  );
}

export function TiktokEmbed({ url }: Readonly<{ url: string }>) {
  const username = getTiktokUsername(url);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    if (!username) return;
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    const observer = new MutationObserver(() => {
      if (container.querySelector("iframe")) setIsLoaded(true);
    });
    observer.observe(container, { childList: true, subtree: true });

    loadTiktokEmbedScript().then(() => {
      if (!cancelled) window.tiktokEmbed?.lib?.render?.();
    });

    const timeoutId = window.setTimeout(() => {
      if (!cancelled && !container.querySelector("iframe")) setHasFailed(true);
    }, TIKTOK_EMBED_TIMEOUT_MS);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearTimeout(timeoutId);
    };
  }, [username]);

  if (!username) return null;

  if (hasFailed) return <TiktokLinkFallback url={url} />;

  return (
    <div className="socials-block__item socials-block__item--tiktok" aria-label={FOOTER_TIKTOK_ARIA}>
      <SocialBoxTitle url={url} iconName="tiktok" label={SOCIALS_TIKTOK_LABEL} />
      <div className="socials-block__item-content" data-loaded={isLoaded} ref={containerRef}>
        <SocialEmbedLoader />
        <blockquote className="tiktok-embed" cite={url} data-unique-id={username} data-embed-type="creator">
          <section />
        </blockquote>
      </div>
    </div>
  );
}
