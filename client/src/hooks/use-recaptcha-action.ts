import { useCallback, useTransition } from "react";
import { useRecaptcha, isRecaptchaConfigured } from "@/components/recaptcha-provider";
import { useCookieConsent } from "@/context/cookie-consent-context";

export function useRecaptchaAction(
  formAction: (formData: FormData) => void,
  action = "form_submit"
) {
  const { executeRecaptcha } = useRecaptcha();
  const { openPreferences } = useCookieConsent();
  const [, startTransition] = useTransition();

  return useCallback(
    async (baseFormData: FormData) => {
      if (!executeRecaptcha && isRecaptchaConfigured) {
        openPreferences();
        return;
      }

      if (executeRecaptcha) {
        const token = await executeRecaptcha(action);
        baseFormData.append("recaptchaToken", token);
      }

      startTransition(() => {
        formAction(baseFormData);
      });
    },
    [executeRecaptcha, openPreferences, formAction, action]
  );
}
