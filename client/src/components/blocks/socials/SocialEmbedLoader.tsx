"use client";

import { useTexts } from "@/context/locale-context";

import CustomCircularProgress from "@/components/custom-ui-components/custom-circular-progress/custom-circular-progress";

export function SocialEmbedLoader() {
  const { LOADING_LABEL } = useTexts();
  return (
    <div className="socials-block__loader" aria-label={LOADING_LABEL}>
      <CustomCircularProgress enableTrackSlot size="4rem" />
    </div>
  );
}
