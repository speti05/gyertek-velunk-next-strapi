"use client";

import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import { useCookieConsent } from "@/context/cookie-consent-context";
import {
  COOKIE_BANNER_ACCEPT_ALL,
  COOKIE_BANNER_DECLINE,
  COOKIE_BANNER_SETTINGS,
  COOKIE_PREFS_TITLE,
  COOKIE_PREFS_ACCEPT_ALL,
  COOKIE_PREFS_REJECT_ALL,
  COOKIE_PREFS_SAVE,
  COOKIE_PREFS_CLOSE,
} from "@/utils/texts";

export function CookieConsentInit() {
  const { setConsent } = useCookieConsent();

  useEffect(() => {
    CookieConsent.run({
      autoShow: false,
      onConsent: () => {
        setConsent(
          CookieConsent.acceptedCategory("recaptcha"),
          CookieConsent.acceptedCategory("analytics")
        );
      },
      onChange: () => {
        setConsent(
          CookieConsent.acceptedCategory("recaptcha"),
          CookieConsent.acceptedCategory("analytics")
        );
      },
      categories: {
        necessary: { enabled: true, readOnly: true },
        recaptcha: {
          autoClear: {
            cookies: [{ name: /^_GRECAPTCHA/ }],
          },
        },
        analytics: {
          autoClear: {
            cookies: [{ name: "_ga" }, { name: /^_ga_/ }],
          },
        },
      },
      language: {
        default: "hu",
        translations: {
          hu: {
            consentModal: {
              title: COOKIE_PREFS_TITLE,
              description: COOKIE_BANNER_DECLINE,
              acceptAllBtn: COOKIE_BANNER_ACCEPT_ALL,
              acceptNecessaryBtn: COOKIE_BANNER_DECLINE,
              showPreferencesBtn: COOKIE_BANNER_SETTINGS,
            },
            preferencesModal: {
              title: COOKIE_PREFS_TITLE,
              acceptAllBtn: COOKIE_PREFS_ACCEPT_ALL,
              acceptNecessaryBtn: COOKIE_PREFS_REJECT_ALL,
              savePreferencesBtn: COOKIE_PREFS_SAVE,
              closeIconLabel: COOKIE_PREFS_CLOSE,
              sections: [],
            },
          },
        },
      },
    });
  }, [setConsent]);

  return null;
}
