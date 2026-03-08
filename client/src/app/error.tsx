"use client";

import CustomButton from "@/components/custom-ui-components/custom-button/custom-button";
import {
  ERROR_LABEL,
  GO_HOME_LABEL,
  SERVER_SIDE_ERROR_LABEL,
  TRY_AGAIN_LABEL,
} from "@/utils/texts";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <h2 className="mb-8">500</h2>
      <h5 className="mb-8">{SERVER_SIDE_ERROR_LABEL}</h5>
      <p className="mb-8 text-center max-w-md">{ERROR_LABEL}</p>
      <div className="mb-8">
        <CustomButton
          variant="contained"
          color="primary"
          onClick={() => reset()}
        >
          {TRY_AGAIN_LABEL}
        </CustomButton>
      </div>
      <div className="mb-8">
        <CustomButton variant="contained" color="secondary">
          <Link href="/">{GO_HOME_LABEL}</Link>
        </CustomButton>
      </div>
    </div>
  );
}
