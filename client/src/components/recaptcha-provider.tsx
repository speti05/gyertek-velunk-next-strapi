"use client";

import { createContext, useContext, useEffect } from "react";
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

  // Effects run after commit, so once this is set every form already holds executeRecaptcha.
  // The e2e tests wait for it before submitting (e2e/support/site.ts).
  useEffect(() => {
    if (!executeRecaptcha) return;
    document.body.dataset.recaptchaReady = "true";
    return () => {
      delete document.body.dataset.recaptchaReady;
    };
  }, [executeRecaptcha]);

  return (
    <RecaptchaContext.Provider value={{ executeRecaptcha }}>{children}</RecaptchaContext.Provider>
  );
}

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
export const isRecaptchaConfigured = !!(siteKey && !siteKey.includes("your_recaptcha"));

/**
 * Without a site key the forms submit with no token, and the server skips the check when it
 * has no secret either (data/actions.ts). Mark that as ready too, so the e2e tests - which run
 * without keys in CI - do not wait for a reCAPTCHA that never loads.
 */
function useUnconfiguredRecaptchaMarker() {
  useEffect(() => {
    if (isRecaptchaConfigured) return;
    document.body.dataset.recaptchaReady = "unconfigured";
    return () => {
      delete document.body.dataset.recaptchaReady;
    };
  }, []);
}

export function RecaptchaProvider({ children }: { children: React.ReactNode }) {
  const { recaptchaConsented } = useCookieConsent();
  useUnconfiguredRecaptchaMarker();

  if (!siteKey || !isRecaptchaConfigured || !recaptchaConsented) {
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
