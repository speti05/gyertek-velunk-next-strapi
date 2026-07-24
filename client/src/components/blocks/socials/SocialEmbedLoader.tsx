"use client";

import CircularProgress from "@mui/material/CircularProgress";
import { LOADING_LABEL } from "@/utils/texts";

export function SocialEmbedLoader() {
  return (
    <div className="socials-block__loader" aria-label={LOADING_LABEL}>
      <CircularProgress enableTrackSlot size="4rem" />
    </div>
  );
}
