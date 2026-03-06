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
      <h2>500</h2>
      <h3>{SERVER_SIDE_ERROR_LABEL}</h3>
      <p className="mb-8 text-center max-w-md">{ERROR_LABEL}</p>
      <CustomButton
        variant="contained"
        color="primary"
        onClick={() => reset()}
        className="mt-6"
      >
        {TRY_AGAIN_LABEL}
      </CustomButton>

      <CustomButton
        variant="contained"
        color="secondary"
        onClick={() => reset()}
        className="mt-6"
      >
        <Link href="/">{GO_HOME_LABEL}</Link>
      </CustomButton>
    </div>
  );
}
