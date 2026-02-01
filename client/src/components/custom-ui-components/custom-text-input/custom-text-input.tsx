'use client';

import React from 'react';
import { FormControl, InputLabel, TextField, TextFieldProps } from '@mui/material';

type CustomCalendarInputProps = TextFieldProps & {
    label?: string;     
    error?: string;
};

const CustomCalendarInput = React.forwardRef<
    HTMLInputElement,
    CustomCalendarInputProps
>(({ children, ...props }, ref) => {

    return (
        <FormControl fullWidth error={!!props.error}>
            {props.label && (
                <InputLabel id={`${props.id}-label`} required={props.required}>
                    {props.label}
                </InputLabel>
            )}
        <TextField
            className='custom-text-input'
            {...props}
        />
        </FormControl>
    );
});

CustomCalendarInput.displayName = 'CustomCalendarInput';

export default CustomCalendarInput;