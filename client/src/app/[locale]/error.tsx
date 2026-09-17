"use client";
import { useTexts } from "@/context/locale-context";

import { ErrorPage } from "@/components/ErrorPage";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { ERROR_LABEL, SERVER_SIDE_ERROR_LABEL } = useTexts();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorPage title={SERVER_SIDE_ERROR_LABEL} description={ERROR_LABEL} onRetry={reset} />;
}
