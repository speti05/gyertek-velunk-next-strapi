"use client";

import React from "react";
import Alert from "@mui/material/Alert";

interface AlertMessageProps {
  errorMessage?: React.ReactNode | null;
  successMessage?: React.ReactNode | null;
  infoMessage?: React.ReactNode | null;
  warningMessage?: React.ReactNode | null;
}

export function CustomAlertMessage({
  errorMessage,
  successMessage,
  infoMessage,
  warningMessage,
}: AlertMessageProps) {
  if (!errorMessage && !successMessage && !infoMessage && !warningMessage) return null;

  return (
    <>
      {warningMessage && (
        <Alert severity="warning" sx={{ mt: 1, mb: 1 }}>
          {warningMessage}
        </Alert>
      )}
      {infoMessage && (
        <Alert severity="info" sx={{ mt: 1, mb: 1 }}>
          {infoMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mt: 1, mb: 1 }}>
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mt: 1, mb: 1 }}>
          {successMessage}
        </Alert>
      )}
    </>
  );
}
