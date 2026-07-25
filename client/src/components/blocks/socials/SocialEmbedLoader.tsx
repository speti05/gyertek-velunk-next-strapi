"use client";

import CustomCircularProgress from "@/components/custom-ui-components/custom-circular-progress/custom-circular-progress";
import { LOADING_LABEL } from "@/utils/texts";

export function SocialEmbedLoader() {
  return (
    <div className="socials-block__loader" aria-label={LOADING_LABEL}>
      <CustomCircularProgress enableTrackSlot size="4rem" />
    </div>
  );
}
