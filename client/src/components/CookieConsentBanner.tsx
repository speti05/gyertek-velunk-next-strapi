"use client";

import { useEffect, useState } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import { useCookieConsent } from "@/context/cookie-consent-context";
import { useTexts } from "@/context/locale-context";
import { AUTH_COOKIE, USER_EMAIL_COOKIE } from "@/data/auth-guard";

import CustomButton from "@/components/custom-ui-components/custom-button/custom-button";
import { CustomDialog } from "@/components/custom-ui-components/custom-dialog/custom-dialog";
import CustomSwitch from "@/components/custom-ui-components/custom-switch/custom-switch";
import CustomIconButton from "@/components/custom-ui-components/custom-icon-button/custom-icon-button";
import CustomAccordion from "@/components/custom-ui-components/custom-accordion/custom-accordion";
import CustomTypography from "@/components/custom-ui-components/custom-typography/custom-typography";
import CustomBox from "@/components/custom-ui-components/custom-box/custom-box";
import CustomIcon from "@/components/custom-ui-components/custom-icon/custom-icon";
import { colors } from "@/sass/mui-override/colors";

type CookieRow = { name: string; domain: string; expiration: string; description: string };

function CookieTable({ rows }: { rows: CookieRow[] }) {
  const { COOKIE_TABLE_NAME, COOKIE_TABLE_DOMAIN, COOKIE_TABLE_EXPIRATION, COOKIE_TABLE_DESCRIPTION } =
    useTexts();

  return (
    <CustomBox sx={{ overflowX: "auto", mt: 1.5 }}>
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
    </CustomBox>
  );
}

export function CookieConsentBanner() {
  const { COOKIE_BANNER_TITLE, COOKIE_BANNER_DESCRIPTION, COOKIE_BANNER_ACCEPT_ALL, COOKIE_BANNER_SETTINGS, COOKIE_PREFS_TITLE, COOKIE_PREFS_ACCEPT_ALL, COOKIE_PREFS_REJECT_ALL, COOKIE_PREFS_SAVE, COOKIE_NECESSARY_TITLE, COOKIE_NECESSARY_DESCRIPTION, COOKIE_FUNCTIONAL_TITLE, COOKIE_FUNCTIONAL_DESCRIPTION, COOKIE_ANALYTICS_TITLE, COOKIE_ANALYTICS_DESCRIPTION, COOKIE_JWT_DESC, COOKIE_EMAIL_DESC, COOKIE_CC_DESC, COOKIE_RECAPTCHA_DESC, COOKIE_GA_DESC, COOKIE_GA_SESSION_DESC, COOKIE_DOMAIN_SITE, COOKIE_DOMAIN_GOOGLE, COOKIE_EXPIRY_7_DAYS, COOKIE_EXPIRY_6_MONTHS, COOKIE_EXPIRY_1_YEAR, COOKIE_EXPIRY_2_YEARS, COOKIE_PREFS_CLOSE } = useTexts();

  const NECESSARY_COOKIES = [
    {
      name: AUTH_COOKIE,
      domain: COOKIE_DOMAIN_SITE,
      expiration: COOKIE_EXPIRY_7_DAYS,
      description: COOKIE_JWT_DESC,
    },
    {
      name: USER_EMAIL_COOKIE,
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

  const [wasPreferencesOpen, setWasPreferencesOpen] = useState(preferencesOpen);

  // openPreferences is called from several hooks, so the draft is reset here on the open transition, during render
  if (preferencesOpen !== wasPreferencesOpen) {
    setWasPreferencesOpen(preferencesOpen);
    if (preferencesOpen) {
      setRecaptchaEnabled(recaptchaConsented);
      setAnalyticsEnabled(analyticsConsented);
    }
  }

  const isBannerVisible = !hasResponded || preferencesOpen;

  // The reCAPTCHA badge sits in this same corner, so it is faded out while the banner
  // holds it - see sass/components/_recaptcha-badge.scss.
  useEffect(() => {
    document.body.classList.toggle("cookie-banner-open", isBannerVisible);
    return () => document.body.classList.remove("cookie-banner-open");
  }, [isBannerVisible]);

  if (!isBannerVisible) return null;

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
    <CustomBox sx={{ display: "flex", gap: 1, flexWrap: "wrap", p: 1, width: "100%" }}>
      <CustomButton variant="contained" color="primary" onClick={handleAcceptAll} sx={{ flex: 1 }}>
        {COOKIE_PREFS_ACCEPT_ALL}
      </CustomButton>
      <CustomButton variant="outlined" color="primary" onClick={handleRejectAll} sx={{ flex: 1 }}>
        {COOKIE_PREFS_REJECT_ALL}
      </CustomButton>
      <CustomButton variant="contained" color="secondary" onClick={handleSave} sx={{ flex: 1 }}>
        {COOKIE_PREFS_SAVE}
      </CustomButton>
    </CustomBox>
  );

  const closeButton = (
    <CustomIconButton
      onClick={() => closePreferences()}
      size="large"
      aria-label={COOKIE_PREFS_CLOSE}
    >
      <CustomIcon name="close" fontSize="large" />
    </CustomIconButton>
  );

  return (
    <>
      {!hasResponded && !preferencesOpen && (
        <div className="cookie-banner">
          <h2 className="cookie-banner__title">{COOKIE_BANNER_TITLE}</h2>
          <CustomTypography className="cookie-banner__description">
            {COOKIE_BANNER_DESCRIPTION}
          </CustomTypography>
          <CustomBox className="cookie-banner__actions">
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
          </CustomBox>
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
      >
        <CustomBox sx={{ p: 0 }}>
          <CustomAccordion
            title={COOKIE_NECESSARY_TITLE}
            headerAction={<CustomSwitch checked disabled />}
            sx={{ borderBottom: `1px solid ${colors.divider}` }}
          >
            <CustomTypography sx={{ fontSize: "1.4rem", color: "text.secondary", mb: 1 }}>
              {COOKIE_NECESSARY_DESCRIPTION}
            </CustomTypography>
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
            sx={{ borderBottom: `1px solid ${colors.divider}` }}
          >
            <CustomTypography sx={{ fontSize: "1.4rem", color: "text.secondary", mb: 1 }}>
              {COOKIE_FUNCTIONAL_DESCRIPTION}
            </CustomTypography>
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
            <CustomTypography sx={{ fontSize: "1.4rem", color: "text.secondary", mb: 1 }}>
              {COOKIE_ANALYTICS_DESCRIPTION}
            </CustomTypography>
            <CookieTable rows={ANALYTICS_COOKIES} />
          </CustomAccordion>
        </CustomBox>
      </CustomDialog>
    </>
  );
}
