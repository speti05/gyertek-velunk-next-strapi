"use client";

import { useEffect } from "react";

const BADGE_SELECTOR = ".grecaptcha-badge";
const OPEN_CLASS = "grecaptcha-badge--open";

/** How long a tapped badge stays open before it folds back into its circle. */
export const RECAPTCHA_BADGE_OPEN_DURATION = 5000;

/**
 * Opens the cropped reCAPTCHA badge on a tap, the way hovering opens it with a pointer.
 * Without this the "Privacy" and "Terms" links Google's terms of service require are
 * unreachable on touch, where there is no hover at all.
 *
 * The badge belongs to Google - it is injected into <body> outside the React tree - so
 * it is driven by a class rather than by state.
 */
export function useRecaptchaBadgeExpand() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const open = () => {
      const badge = document.querySelector(BADGE_SELECTOR);
      if (!badge) return;
      badge.classList.add(OPEN_CLASS);
      // Restarts on every tap, so tapping an open badge keeps it open rather than
      // letting a timer from the first tap close it mid-read.
      clearTimeout(timer);
      timer = setTimeout(() => badge.classList.remove(OPEN_CLASS), RECAPTCHA_BADGE_OPEN_DURATION);
    };

    // The badge's own markup - the frame around the mark, once it is open.
    const onPointerDown = (event: PointerEvent) => {
      if ((event.target as Element | null)?.closest?.(BADGE_SELECTOR)) open();
    };

    // The mark itself is a cross-origin iframe, so a tap on it never reaches this
    // document. Focus does move into that iframe though, and the window loses focus
    // with it, which is what a tap on the mark is read from here.
    const onWindowBlur = () => {
      const active = document.activeElement;
      if (active?.tagName === "IFRAME" && active.closest(BADGE_SELECTOR)) open();
    };

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("blur", onWindowBlur);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("blur", onWindowBlur);
      clearTimeout(timer);
    };
  }, []);
}
