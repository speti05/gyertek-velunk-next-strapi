"use client";

import React from "react";
import Box from "@mui/material/Box";
import { CustomDialog } from "@/components/custom-ui-components/custom-dialog/custom-dialog";
import CustomButton from "@/components/custom-ui-components/custom-button/custom-button";
import { useTexts } from "@/context/locale-context";

type CustomConfirmDialogProps = {
  open: boolean;
  title: string;
  content: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
};

export const CustomConfirmDialog: React.FC<CustomConfirmDialogProps> = ({
  open,
  title,
  content,
  onCancel,
  onConfirm,
  cancelLabel,
  confirmLabel,
}) => {
  const { DIALOG_CANCEL_LABEL, DIALOG_PROCEED_LABEL } = useTexts();
  const resolvedCancelLabel = cancelLabel ?? DIALOG_CANCEL_LABEL;
  const resolvedConfirmLabel = confirmLabel ?? DIALOG_PROCEED_LABEL;
  const actions = (
    <Box sx={{ display: "flex", gap: 1, width: "100%", p: 1 }}>
      <CustomButton variant="outlined" color="inherit" sx={{ flex: 1 }} onClick={onCancel}>
        {resolvedCancelLabel}
      </CustomButton>
      <CustomButton variant="contained" color="error" sx={{ flex: 1 }} onClick={onConfirm}>
        {resolvedConfirmLabel}
      </CustomButton>
    </Box>
  );

  return (
    <CustomDialog
      open={open}
      onClose={onCancel}
      title={title}
      actions={actions}
      closeOnBackdropClick
      maxWidth="xs"
      fullWidth
    >
      {content}
    </CustomDialog>
  );
};
