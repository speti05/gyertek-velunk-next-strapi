"use client";

import React, { useState } from "react";
import { AUTH_HIDE_PASSWORD_LABEL, AUTH_SHOW_PASSWORD_LABEL } from "@/utils/texts";
import { FormControl, TextField, TextFieldProps, InputAdornment, IconButton } from "@mui/material";
import CustomIcon from "../custom-icon/custom-icon";
import style from "./custom-text-input.module.scss";

type CustomTextInputInputProps = Omit<TextFieldProps, "error"> & {
  error?: string | boolean;
};

const CustomTextInput = React.forwardRef<HTMLInputElement, CustomTextInputInputProps>(
  ({ error, type, slotProps, ...props }, ref) => {
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState(false);

    const passwordAdornment = isPassword ? (
      <InputAdornment position="end">
        <IconButton
          aria-label={showPassword ? AUTH_HIDE_PASSWORD_LABEL : AUTH_SHOW_PASSWORD_LABEL}
          onClick={() => setShowPassword((prev) => !prev)}
          onMouseDown={(e) => e.preventDefault()}
          edge="end"
          suppressHydrationWarning
        >
          {showPassword ? <CustomIcon name="visibilityOff" /> : <CustomIcon name="visibility" />}
        </IconButton>
      </InputAdornment>
    ) : undefined;

    return (
      <FormControl fullWidth className={style.customTextInput}>
        <TextField
          inputRef={ref}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          {...props}
          error={!!error}
          slotProps={{
            ...(slotProps ?? {}),
            input: {
              ...((slotProps?.input as object) ?? {}),
              endAdornment: passwordAdornment,
              suppressHydrationWarning: true,
            },
            htmlInput: {
              ...((slotProps?.htmlInput as object) ?? {}),
              suppressHydrationWarning: true,
            },
          }}
          helperText={error}
        />
      </FormControl>
    );
  }
);

CustomTextInput.displayName = "CustomTextInput";
export default CustomTextInput;
