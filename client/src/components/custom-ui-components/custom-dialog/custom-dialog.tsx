'use client';

import React from 'react';
import { DIALOG_CONFIRM_LABEL, DIALOG_CANCEL_LABEL } from '@/utils/texts';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

type CustomDialogProps = Omit<DialogProps, 'open' | 'onClose'> & {
    open: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    children?: React.ReactNode;
    onConfirm?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmDisabled?: boolean;
};

export const CustomDialog: React.FC<CustomDialogProps> = ({
    open,
    onClose,
    title,
    children,
    onConfirm,
    confirmLabel = DIALOG_CONFIRM_LABEL,
    cancelLabel = DIALOG_CANCEL_LABEL,
    confirmDisabled = false,
    ...props
}) => {
    return (
        <Dialog open={open} onClose={onClose} {...props}>
            {title && <DialogTitle>{title}</DialogTitle>}
            {children && <DialogContent>{children}</DialogContent>}
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    {cancelLabel}
                </Button>
                {onConfirm && (
                    <Button onClick={onConfirm} variant="contained" color="primary" disabled={confirmDisabled}>
                        {confirmLabel}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};
