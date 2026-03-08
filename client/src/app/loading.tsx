'use client';

import { LOADING_LABEL } from "@/utils/texts";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loading() {
  return (
    <div className="flex items-center justify-center flex-1">
      <div className="text-center">
            <CircularProgress enableTrackSlot size="6rem" className="mb-8"/>
        <h3>{LOADING_LABEL}</h3>
      </div>
    </div>
  );
}