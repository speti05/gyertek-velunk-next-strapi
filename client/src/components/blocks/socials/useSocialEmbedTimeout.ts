"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const SOCIAL_EMBED_TIMEOUT_MS = 30000;

type EmbedStatus = "loading" | "loaded" | "failed";

export function useSocialEmbedTimeout(timeoutMs: number = SOCIAL_EMBED_TIMEOUT_MS) {
  const [status, setStatus] = useState<EmbedStatus>("loading");
  const timeoutIdRef = useRef<number | null>(null);

  const clearPendingTimeout = () => {
    if (timeoutIdRef.current === null) return;
    window.clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = null;
  };

  const markLoaded = useCallback(() => {
    clearPendingTimeout();
    setStatus("loaded");
  }, []);

  useEffect(() => {
    setStatus("loading");

    timeoutIdRef.current = window.setTimeout(() => {
      timeoutIdRef.current = null;
      setStatus("failed");
    }, timeoutMs);

    return clearPendingTimeout;
  }, [timeoutMs]);

  return { isLoaded: status === "loaded", hasFailed: status === "failed", markLoaded };
}

export function watchForEmbedIframe(container: HTMLElement, onAppear: () => void): () => void {
  if (container.querySelector("iframe")) {
    onAppear();
    return () => {};
  }

  const observer = new MutationObserver(() => {
    if (container.querySelector("iframe")) onAppear();
  });
  observer.observe(container, { childList: true, subtree: true });
  return () => observer.disconnect();
}

// Waits for the iframe to appear AND finish loading its own document, rather than treating mere DOM presence as "ready" - some embed SDKs insert the iframe before its content has actually rendered.
export function watchForEmbedIframeLoad(container: HTMLElement, onLoaded: () => void): () => void {
  let detachIframeListener: (() => void) | null = null;

  const attachToIframe = (iframe: HTMLIFrameElement) => {
    if (detachIframeListener) return;
    iframe.addEventListener("load", onLoaded, { once: true });
    detachIframeListener = () => iframe.removeEventListener("load", onLoaded);
  };

  const existingIframe = container.querySelector<HTMLIFrameElement>("iframe");
  if (existingIframe) attachToIframe(existingIframe);

  const observer = new MutationObserver(() => {
    const iframe = container.querySelector<HTMLIFrameElement>("iframe");
    if (iframe) attachToIframe(iframe);
  });
  observer.observe(container, { childList: true, subtree: true });

  return () => {
    observer.disconnect();
    detachIframeListener?.();
  };
}
