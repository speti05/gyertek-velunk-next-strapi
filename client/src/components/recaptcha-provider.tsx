"use client";

import { createContext, useContext } from "react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useCookieConsent } from "@/context/cookie-consent-context";
import { useRecaptchaBadgeExpand } from "@/hooks/use-recaptcha-badge-expand";

type RecaptchaContextValue = {
  executeRecaptcha: ((action: string) => Promise<string>) | undefined;
};

const RecaptchaContext = createContext<RecaptchaContextValue>({ executeRecaptcha: undefined });

export function useRecaptcha() {
  return useContext(RecaptchaContext);
}

function RecaptchaBridge({ children }: { children: React.ReactNode }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  // Only mounted once the badge is actually on the page, so the listeners are not
  // hanging off the document for visitors who never load reCAPTCHA.
  useRecaptchaBadgeExpand();
  return (
    <RecaptchaContext.Provider value={{ executeRecaptcha }}>{children}</RecaptchaContext.Provider>
  );
}

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
export const isRecaptchaConfigured = !!(siteKey && !siteKey.includes("your_recaptcha"));

export function RecaptchaProvider({ children }: { children: React.ReactNode }) {
  const { recaptchaConsented } = useCookieConsent();

  if (!isRecaptchaConfigured || !recaptchaConsented) {
    return (
      <RecaptchaContext.Provider value={{ executeRecaptcha: undefined }}>
        {children}
      </RecaptchaContext.Provider>
    );
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      <RecaptchaBridge>{children}</RecaptchaBridge>
    </GoogleReCaptchaProvider>
  );
}
