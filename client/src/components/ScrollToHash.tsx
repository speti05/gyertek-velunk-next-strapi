"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const MAX_ATTEMPTS = 20;
const RETRY_DELAY_MS = 100;

export function ScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const targetId = decodeURIComponent(hash.slice(1));
    let attempts = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tryScroll = () => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      attempts += 1;
      if (attempts < MAX_ATTEMPTS) {
        timeoutId = setTimeout(tryScroll, RETRY_DELAY_MS);
      }
    };

    tryScroll();

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
