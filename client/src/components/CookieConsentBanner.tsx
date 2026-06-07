"use client";

import { useEffect, useState } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import { useCookieConsent } from "@/context/cookie-consent-context";
import {
  COOKIE_BANNER_TITLE,
  COOKIE_BANNER_DESCRIPTION,
  COOKIE_BANNER_ACCEPT_ALL,
  COOKIE_BANNER_SETTINGS,
  COOKIE_PREFS_TITLE,
  COOKIE_PREFS_ACCEPT_ALL,
  COOKIE_PREFS_REJECT_ALL,
  COOKIE_PREFS_SAVE,
  COOKIE_NECESSARY_TITLE,
  COOKIE_NECESSARY_DESCRIPTION,
  COOKIE_FUNCTIONAL_TITLE,
  COOKIE_FUNCTIONAL_DESCRIPTION,
  COOKIE_ANALYTICS_TITLE,
  COOKIE_ANALYTICS_DESCRIPTION,
  COOKIE_TABLE_NAME,
  COOKIE_TABLE_DOMAIN,
  COOKIE_TABLE_EXPIRATION,
  COOKIE_TABLE_DESCRIPTION,
  COOKIE_JWT_DESC,
  COOKIE_EMAIL_DESC,
  COOKIE_CC_DESC,
  COOKIE_RECAPTCHA_DESC,
  COOKIE_GA_DESC,
  COOKIE_GA_SESSION_DESC,
  COOKIE_DOMAIN_SITE,
  COOKIE_DOMAIN_GOOGLE,
  COOKIE_EXPIRY_7_DAYS,
  COOKIE_EXPIRY_6_MONTHS,
  COOKIE_EXPIRY_1_YEAR,
  COOKIE_EXPIRY_2_YEARS,
} from "@/utils/texts";

import CustomButton from "@/components/custom-ui-components/custom-button/custom-button";
import { CustomDialog } from "@/components/custom-ui-components/custom-dialog/custom-dialog";
import CustomSwitch from "@/components/custom-ui-components/custom-switch/custom-switch";
import CustomIconButton from "@/components/custom-ui-components/custom-icon-button/custom-icon-button";
import CustomAccordion from "@/components/custom-ui-components/custom-accordion/custom-accordion";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CustomIcon from "@/components/custom-ui-components/custom-icon/custom-icon";

const NECESSARY_COOKIES = [
  {
    name: "jwt",
    domain: COOKIE_DOMAIN_SITE,
    expiration: COOKIE_EXPIRY_7_DAYS,
    description: COOKIE_JWT_DESC,
  },
  {
    name: "user_email",
    domain: COOKIE_DOMAIN_SITE,
    expiration: COOKIE_EXPIRY_7_DAYS,
    description: COOKIE_EMAIL_DESC,
  },
  {
    name: "cc_cookie",
    domain: COOKIE_DOMAIN_SITE,
    expiration: COOKIE_EXPIRY_1_YEAR,
    description: COOKIE_CC_DESC,
  },
];

const RECAPTCHA_COOKIES = [
  {
    name: "_GRECAPTCHA",
    domain: COOKIE_DOMAIN_GOOGLE,
    expiration: COOKIE_EXPIRY_6_MONTHS,
    description: COOKIE_RECAPTCHA_DESC,
  },
];

const ANALYTICS_COOKIES = [
  {
    name: "_ga",
    domain: COOKIE_DOMAIN_GOOGLE,
    expiration: COOKIE_EXPIRY_2_YEARS,
    description: COOKIE_GA_DESC,
  },
  {
    name: "_ga_*",
    domain: COOKIE_DOMAIN_GOOGLE,
    expiration: COOKIE_EXPIRY_2_YEARS,
    description: COOKIE_GA_SESSION_DESC,
  },
];

type CookieRow = { name: string; domain: string; expiration: string; description: string };

function CookieTable({ rows }: { rows: CookieRow[] }) {
  return (
    <Box sx={{ overflowX: "auto", mt: 1.5 }}>
      <table className="cookie-table">
        <thead>
          <tr>
            <th>{COOKIE_TABLE_NAME}</th>
            <th>{COOKIE_TABLE_DOMAIN}</th>
            <th>{COOKIE_TABLE_EXPIRATION}</th>
            <th>{COOKIE_TABLE_DESCRIPTION}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td>{row.domain}</td>
              <td>{row.expiration}</td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}

export function CookieConsentBanner() {
  const {
    hasResponded,
    recaptchaConsented,
    analyticsConsented,
    preferencesOpen,
    setConsent,
    openPreferences,
    closePreferences,
  } = useCookieConsent();
  const [recaptchaEnabled, setRecaptchaEnabled] = useState(recaptchaConsented);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(analyticsConsented);

  useEffect(() => {
    if (preferencesOpen) {
      setRecaptchaEnabled(recaptchaConsented);
      setAnalyticsEnabled(analyticsConsented);
    }
  }, [preferencesOpen, recaptchaConsented, analyticsConsented]);

  if (hasResponded && !preferencesOpen) return null;

  function buildCategories(recaptcha: boolean, analytics: boolean) {
    const cats: string[] = [];
    if (recaptcha) cats.push("recaptcha");
    if (analytics) cats.push("analytics");
    return cats;
  }

  function handleAcceptAll() {
    CookieConsent.acceptCategory("all");
    setConsent(true, true);
    closePreferences();
  }

  function handleRejectAll() {
    CookieConsent.acceptCategory([]);
    setConsent(false, false);
    closePreferences();
  }

  function handleSave() {
    CookieConsent.acceptCategory(buildCategories(recaptchaEnabled, analyticsEnabled));
    setConsent(recaptchaEnabled, analyticsEnabled);
    closePreferences();
  }

  const dialogActions = (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", p: 1, width: "100%" }}>
      <CustomButton variant="contained" color="primary" onClick={handleAcceptAll} sx={{ flex: 1 }}>
        {COOKIE_PREFS_ACCEPT_ALL}
      </CustomButton>
      <CustomButton variant="outlined" color="primary" onClick={handleRejectAll} sx={{ flex: 1 }}>
        {COOKIE_PREFS_REJECT_ALL}
      </CustomButton>
      <CustomButton variant="contained" color="secondary" onClick={handleSave} sx={{ flex: 1 }}>
        {COOKIE_PREFS_SAVE}
      </CustomButton>
    </Box>
  );

  const closeButton = (
    <CustomIconButton onClick={() => closePreferences()} size="large" aria-label="Bezárás">
      <CustomIcon name="close" fontSize="large" />
    </CustomIconButton>
  );

  return (
    <>
      {!hasResponded && !preferencesOpen && (
        <div className="cookie-banner">
          <h2 className="cookie-banner__title">{COOKIE_BANNER_TITLE}</h2>
          <Typography className="cookie-banner__description">
            {COOKIE_BANNER_DESCRIPTION}
          </Typography>
          <Box className="cookie-banner__actions">
            <CustomButton variant="contained" color="primary" onClick={handleAcceptAll} fullWidth>
              {COOKIE_BANNER_ACCEPT_ALL}
            </CustomButton>
            <CustomButton
              variant="outlined"
              color="primary"
              onClick={() => openPreferences()}
              fullWidth
            >
              {COOKIE_BANNER_SETTINGS}
            </CustomButton>
          </Box>
        </div>
      )}

      <CustomDialog
        open={preferencesOpen}
        onClose={() => closePreferences()}
        title={COOKIE_PREFS_TITLE}
        headerAction={closeButton}
        contentDividers
        actions={dialogActions}
        maxWidth="sm"
        fullWidth
        scroll="paper"
        disableScrollLock
      >
        <Box sx={{ p: 0 }}>
          <CustomAccordion
            title={COOKIE_NECESSARY_TITLE}
            headerAction={<CustomSwitch checked disabled />}
            sx={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
          >
            <Typography sx={{ fontSize: "1.4rem", color: "text.secondary", mb: 1 }}>
              {COOKIE_NECESSARY_DESCRIPTION}
            </Typography>
            <CookieTable rows={NECESSARY_COOKIES} />
          </CustomAccordion>

          <CustomAccordion
            title={COOKIE_FUNCTIONAL_TITLE}
            headerAction={
              <CustomSwitch
                checked={recaptchaEnabled}
                onChange={() => setRecaptchaEnabled((v) => !v)}
              />
            }
            sx={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
          >
            <Typography sx={{ fontSize: "1.4rem", color: "text.secondary", mb: 1 }}>
              {COOKIE_FUNCTIONAL_DESCRIPTION}
            </Typography>
            <CookieTable rows={RECAPTCHA_COOKIES} />
          </CustomAccordion>

          <CustomAccordion
            title={COOKIE_ANALYTICS_TITLE}
            headerAction={
              <CustomSwitch
                checked={analyticsEnabled}
                onChange={() => setAnalyticsEnabled((v) => !v)}
              />
            }
          >
            <Typography sx={{ fontSize: "1.4rem", color: "text.secondary", mb: 1 }}>
              {COOKIE_ANALYTICS_DESCRIPTION}
            </Typography>
            <CookieTable rows={ANALYTICS_COOKIES} />
          </CustomAccordion>
        </Box>
      </CustomDialog>
    </>
  );
}
