"use client";

import { createContext, useContext, useState } from "react";

interface CookieConsentContextType {
  hasResponded: boolean;
  recaptchaConsented: boolean;
  analyticsConsented: boolean;
  preferencesOpen: boolean;
  setConsent: (recaptchaAccepted: boolean, analyticsAccepted: boolean) => void;
  openPreferences: () => void;
  closePreferences: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType>({
  hasResponded: false,
  recaptchaConsented: false,
  analyticsConsented: false,
  preferencesOpen: false,
  setConsent: () => {},
  openPreferences: () => {},
  closePreferences: () => {},
});

export function CookieConsentProvider({
  initialHasResponded,
  initialRecaptchaConsented,
  initialAnalyticsConsented,
  children,
}: {
  initialHasResponded: boolean;
  initialRecaptchaConsented: boolean;
  initialAnalyticsConsented: boolean;
  children: React.ReactNode;
}) {
  const [hasResponded, setHasResponded] = useState(initialHasResponded);
  const [recaptchaConsented, setRecaptchaConsented] = useState(initialRecaptchaConsented);
  const [analyticsConsented, setAnalyticsConsented] = useState(initialAnalyticsConsented);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  function setConsent(recaptchaAccepted: boolean, analyticsAccepted: boolean) {
    setHasResponded(true);
    setRecaptchaConsented(recaptchaAccepted);
    setAnalyticsConsented(analyticsAccepted);
  }

  return (
    <CookieConsentContext.Provider
      value={{
        hasResponded,
        recaptchaConsented,
        analyticsConsented,
        preferencesOpen,
        setConsent,
        openPreferences: () => setPreferencesOpen(true),
        closePreferences: () => setPreferencesOpen(false),
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  return useContext(CookieConsentContext);
}
