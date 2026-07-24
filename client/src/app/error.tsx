"use client";

import { ErrorPage } from "@/components/ErrorPage";
import { ERROR_LABEL, SERVER_SIDE_ERROR_LABEL } from "@/utils/texts";
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

  return <ErrorPage title={SERVER_SIDE_ERROR_LABEL} description={ERROR_LABEL} onRetry={reset} />;
}
