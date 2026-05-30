"use client";
import { useFormStatus } from "react-dom";
import CustomButton from "@/components/custom-ui-components/custom-button/custom-button";
import { LOADING_LABEL } from "@/utils/texts";

interface SubmitButtonProps {
  text: string;
  className?: string;
  disabled?: boolean;
}

export function SubmitButton({ text, className, disabled }: Readonly<SubmitButtonProps>) {
  const status = useFormStatus();
  return (
    <CustomButton
      variant="contained"
      type="submit"
      size="large"
      color="secondary"
      aria-disabled={status.pending || disabled}
      disabled={status.pending || disabled}
      className={className}
    >
      {status.pending ? LOADING_LABEL : text}
    </CustomButton>
  );
}
