import { useCallback, useTransition, RefObject } from "react";
import { useRecaptcha } from "@/components/recaptcha-provider";
import { isRecaptchaConfigured } from "@/components/recaptcha-provider";
import { useCookieConsent } from "@/context/cookie-consent-context";

export function useRecaptchaSubmit(
  formRef: RefObject<HTMLFormElement | null>,
  formAction: (formData: FormData) => void,
  action = "form_submit"
) {
  const { executeRecaptcha } = useRecaptcha();
  const { openPreferences } = useCookieConsent();
  const [, startTransition] = useTransition();

  return useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!formRef.current) return;

      if (!executeRecaptcha && isRecaptchaConfigured) {
        openPreferences();
        return;
      }

      const formData = new FormData(formRef.current);

      if (executeRecaptcha) {
        const token = await executeRecaptcha(action);
        formData.append("recaptchaToken", token);
      }

      startTransition(() => {
        formAction(formData);
      });
    },
    [executeRecaptcha, openPreferences, formAction, formRef, action]
  );
}
