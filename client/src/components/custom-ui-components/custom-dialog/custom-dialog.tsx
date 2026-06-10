"use client";

import React from "react";
import { DIALOG_CONFIRM_LABEL, DIALOG_CANCEL_LABEL } from "@/utils/texts";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

type CustomDialogProps = Omit<DialogProps, "open" | "onClose"> & {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  /** Node rendered on the right side of the title bar (e.g. a close icon button) */
  headerAction?: React.ReactNode;
  children?: React.ReactNode;
  /** Adds dividers above/below DialogContent */
  contentDividers?: boolean;
  /** Overrides the entire DialogActions section with custom content */
  actions?: React.ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmDisabled?: boolean;
};

export const CustomDialog: React.FC<CustomDialogProps> = ({
  open,
  onClose,
  title,
  headerAction,
  children,
  contentDividers,
  actions,
  onConfirm,
  confirmLabel = DIALOG_CONFIRM_LABEL,
  cancelLabel = DIALOG_CANCEL_LABEL,
  confirmDisabled = false,
  ...props
}) => {
  return (
    <Dialog open={open} onClose={onClose} {...props}>
      {(title || headerAction) && (
        <DialogTitle
          sx={
            headerAction
              ? { display: "flex", justifyContent: "space-between", alignItems: "center", pr: 1 }
              : undefined
          }
        >
          {title}
          {headerAction && <Box sx={{ ml: 1, flexShrink: 0 }}>{headerAction}</Box>}
        </DialogTitle>
      )}
      {children && <DialogContent dividers={contentDividers}>{children}</DialogContent>}
      <DialogActions>
        {actions ?? (
          <>
            <Button onClick={onClose} color="inherit" sx={{ flex: "1" }}>
              {cancelLabel}
            </Button>
            {onConfirm && (
              <Button
                sx={{ flex: "1" }}
                onClick={onConfirm}
                variant="contained"
                color="primary"
                disabled={confirmDisabled}
              >
                {confirmLabel}
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
