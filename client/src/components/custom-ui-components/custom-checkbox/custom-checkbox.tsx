"use client";

import React from "react";
import Checkbox, { CheckboxProps } from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { MandatoryIndicator } from "../mandatory-indicator/mandatory-indicator";
import { MANDATORY_CHECKBOX_TOOLTIP } from "@/utils/texts";

type CustomCheckboxProps = CheckboxProps & {
  label?: React.ReactNode;
  error?: boolean;
  helperText?: string;
  isMandatory?: boolean;
};

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  label,
  error = false,
  helperText,
  isMandatory = false,
  slotProps,
  ...props
}) => {
  return (
    <FormControl error={error}>
      <FormControlLabel
        control={
          <Checkbox
            slotProps={{
              input: { suppressHydrationWarning: true, ...((slotProps?.input as object) ?? {}) },
            }}
            {...props}
          />
        }
        label={
          isMandatory ? (
            <>
              {label} <MandatoryIndicator tooltipText={MANDATORY_CHECKBOX_TOOLTIP} />
            </>
          ) : (
            label
          )
        }
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
