"use client";

import { createContext, useContext } from "react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";

type RecaptchaContextValue = {
  executeRecaptcha: ((action: string) => Promise<string>) | undefined;
};

const RecaptchaContext = createContext<RecaptchaContextValue>({ executeRecaptcha: undefined });

export function useRecaptcha() {
  return useContext(RecaptchaContext);
}

function RecaptchaBridge({ children }: { children: React.ReactNode }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  return (
    <RecaptchaContext.Provider value={{ executeRecaptcha }}>
      {children}
    </RecaptchaContext.Provider>
  );
}

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const isValidKey = siteKey && !siteKey.includes("your_recaptcha");

export function RecaptchaProvider({ children }: { children: React.ReactNode }) {
  if (!isValidKey) {
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
