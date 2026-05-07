'use client';

import React from 'react';
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

type CustomCheckboxProps = CheckboxProps & {
    label?: React.ReactNode;
    error?: boolean;
    helperText?: string;
};

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
    label,
    error = false,
    helperText,
    slotProps,
    ...props
}) => {
    return (
        <FormControl error={error}>
            <FormControlLabel
                control={
                    <Checkbox
                        slotProps={{ input: { suppressHydrationWarning: true, ...((slotProps?.input as object) ?? {}) } }}
                        {...props}
                    />
                }
                label={label}
            />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};
