"use client";

import React from "react";
import Alert from "@mui/material/Alert";

interface AlertMessageProps {
  errorMessage?: React.ReactNode | null;
  successMessage?: React.ReactNode | null;
  infoMessage?: React.ReactNode | null;
}

export function CustomAlertMessage({
  errorMessage,
  successMessage,
  infoMessage,
}: AlertMessageProps) {
  if (!errorMessage && !successMessage && !infoMessage) return null;

  return (
    <>
      {infoMessage && (
        <Alert severity="info" sx={{ mt: 1 }}>
          {infoMessage}
        </Alert>
      )}
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
