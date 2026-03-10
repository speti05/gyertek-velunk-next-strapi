import { useCallback, useTransition, RefObject } from "react";
import { useRecaptcha } from "@/components/recaptcha-provider";

/**
 * Returns a form onSubmit handler that automatically appends a reCAPTCHA v3
 * token before calling the provided server action.
 * If reCAPTCHA is not configured (dev mode or missing key), it submits without a token.
 */
export function useRecaptchaSubmit(
  formRef: RefObject<HTMLFormElement | null>,
  formAction: (formData: FormData) => void,
  action = "form_submit"
) {
  const { executeRecaptcha } = useRecaptcha();
  const [, startTransition] = useTransition();

  return useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!formRef.current) return;

      const formData = new FormData(formRef.current);

      if (executeRecaptcha) {
        const token = await executeRecaptcha(action);
        formData.append("recaptchaToken", token);
      }

      startTransition(() => {
        formAction(formData);
      });
    },
    [executeRecaptcha, formAction, formRef, action]
  );
}
