"use client";

import { useEffect, useRef } from "react";
import { FOOTER_TIKTOK_ARIA, SOCIALS_EMBED_LOAD_ERROR, SOCIALS_TIKTOK_LABEL } from "@/utils/texts";
import { SocialBoxTitle } from "@/components/blocks/socials/SocialBoxTitle";
import { SocialEmbedLoader } from "@/components/blocks/socials/SocialEmbedLoader";
import { CustomAlertMessage } from "@/components/custom-ui-components/custom-alert/custom-alert-message";
import {
  useSocialEmbedTimeout,
  watchForEmbedIframeLoad,
} from "@/components/blocks/socials/useSocialEmbedTimeout";

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

export function TiktokEmbed({ url }: Readonly<{ url: string }>) {
  const username = getTiktokUsername(url);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoaded, hasFailed, markLoaded } = useSocialEmbedTimeout();

  useEffect(() => {
    if (!username) return;
    const container = containerRef.current;
    if (!container) return;

    const stopWatching = watchForEmbedIframeLoad(container, markLoaded);

    let cancelled = false;
    loadTiktokEmbedScript().then(() => {
      if (!cancelled) window.tiktokEmbed?.lib?.render?.();
    });

    return () => {
      cancelled = true;
      stopWatching();
    };
  }, [username, markLoaded]);

  if (!username) return null;

  return (
    <div className="socials-block__item socials-block__item--tiktok" aria-label={FOOTER_TIKTOK_ARIA}>
      <SocialBoxTitle url={url} iconName="tiktok" label={SOCIALS_TIKTOK_LABEL} />
      <div className="socials-block__item-content" data-loaded={isLoaded || hasFailed} ref={containerRef}>
        {hasFailed ? (
          <CustomAlertMessage warningMessage={SOCIALS_EMBED_LOAD_ERROR} />
        ) : (
          <>
            <SocialEmbedLoader />
            <blockquote className="tiktok-embed" cite={url} data-unique-id={username} data-embed-type="creator">
              <section />
            </blockquote>
          </>
        )}
      </div>
    </div>
  );
}
