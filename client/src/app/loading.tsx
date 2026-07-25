"use client";

import { LOADING_LABEL } from "@/utils/texts";
import CustomCircularProgress from "@/components/custom-ui-components/custom-circular-progress/custom-circular-progress";

export default function Loading() {
  return (
    <div className="flex items-center justify-center flex-1">
      <div className="text-center min-h-screen flex flex-col items-center justify-center">
        <CustomCircularProgress enableTrackSlot size="6rem" className="mb-8" />
        <h3>{LOADING_LABEL}</h3>
      </div>
    </div>
  );
}
