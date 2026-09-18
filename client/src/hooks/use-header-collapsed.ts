"use client";

import { useEffect, useState } from "react";

/** How far the page has to move before the header's utility bar slides out of the way. */
export const HEADER_COLLAPSE_SCROLL_THRESHOLD = 8;

/**
 * Whether the page has scrolled far enough for the header to be in its collapsed state.
 * Shared rather than measured per component, so everything keyed to that state - the
 * header itself, the scroll-to-top button - flips at the very same point.
 */
export function useHeaderCollapsed(): boolean {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsCollapsed(window.scrollY > HEADER_COLLAPSE_SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return isCollapsed;
}
