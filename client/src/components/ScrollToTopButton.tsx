"use client";

import { useTexts } from "@/context/locale-context";
import { useHeaderCollapsed } from "@/hooks/use-header-collapsed";
import CustomTooltip from "./custom-ui-components/custom-tooltip/custom-tooltip";
import CustomIconButton from "./custom-ui-components/custom-icon-button/custom-icon-button";
import CustomIcon from "./custom-ui-components/custom-icon/custom-icon";

/**
 * Floats above the bottom right corner of the page and takes the visitor back to the
 * top. It only appears once the header has collapsed, so it never covers anything while
 * the page is still at the top - and it shares that state with the header, so the two
 * always agree on when "scrolled" begins.
 */
export function ScrollToTopButton() {
  const isCollapsed = useHeaderCollapsed();
  const { SCROLL_TO_TOP_LABEL } = useTexts();

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  const className = ["scroll-to-top", isCollapsed ? "scroll-to-top--visible" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    // The wrapper carries the fixed position and the fade: hidden, it is visibility:
    // hidden, which also keeps it out of the tab order while the page is at the top.
    <div className={className}>
      <CustomTooltip title={SCROLL_TO_TOP_LABEL} placement="left">
        <span>
          <CustomIconButton
            type="button"
            className="scroll-to-top__button"
            aria-label={SCROLL_TO_TOP_LABEL}
            onClick={scrollToTop}
          >
            <CustomIcon name="arrowUpward" />
          </CustomIconButton>
        </span>
      </CustomTooltip>
    </div>
  );
}
