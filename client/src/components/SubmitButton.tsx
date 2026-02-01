"use client";
import { useFormStatus } from "react-dom";
import CustomButton from "@/components/custom-ui-components/custom-button/custom-button";

interface SubmitButtonProps {
  text: string;
  className?: string;
}

export function SubmitButton({
  text,
  className,
}: Readonly<SubmitButtonProps>) {
  const status = useFormStatus();
  return (
    <CustomButton
      variant="contained"
      type="submit"
      size="large"
      color="secondary"
      aria-disabled={status.pending}
      disabled={status.pending}
      className={className}
    >
      {status.pending ? "Töltés..." : text}
    </CustomButton>
  );
}