'use client';

import React from 'react';
import { FormControl, TextField, TextFieldProps } from '@mui/material';
import style from './custom-text-input.module.scss';

type CustomTextInputInputProps = TextFieldProps & {
};

const CustomTextInput = React.forwardRef<
    HTMLInputElement,
    CustomTextInputInputProps
>(({ /*children,*/ ...props }, ref) => {

    return (
        <FormControl
            fullWidth
            className={style.customTextInput}>
            <TextField
                inputRef={ref}
                {...props}
                helperText={props.error}/>
        </FormControl>
    );
});

CustomTextInput.displayName = 'CustomTextInput';
export default CustomTextInput;