"use client";

import React from "react";
import {
  Select,
  SelectProps,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
} from "@mui/material";

type CustomSelectProps = SelectProps & {
  label?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  options?: { value: string | number; name: string }[];
  renderOption?: (option: { value: string | number; name: string }) => React.ReactNode;
};

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  error = false,
  helperText,
  required = false,
  id,
  renderOption,
  ...props
}) => {
  return (
    <FormControl fullWidth error={error}>
      {label && (
        <InputLabel id={`${id}-label`} required={required}>
          {label}
        </InputLabel>
      )}
      <Select
        labelId={`${id}-label`}
        id={id}
        label={label}
        /*
                MenuProps={{
                        disableScrollLock: true,
                        variant: "menu",
                        disablePortal: false,
                        anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                        },
                        transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                        },
                }}
                        */
        {...props}
      >
        {props.options?.map((option) => (
          <MenuItem key={option.value} value={option.value} className="no-list-style">
            {renderOption ? renderOption(option) : option.name}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
