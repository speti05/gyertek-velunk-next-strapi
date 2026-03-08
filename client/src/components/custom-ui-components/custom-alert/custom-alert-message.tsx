"use client";

import Alert from "@mui/material/Alert";

interface AlertMessageProps {
  errorMessage?: string | null;
  successMessage?: string | null;
}

export function CustomAlertMessage({ errorMessage, successMessage }: AlertMessageProps) {
  if (!errorMessage && !successMessage) return null;

  return (
    <>
      {errorMessage && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mt: 1 }}>
          {successMessage}
        </Alert>
      )}
    </>
  );
}
