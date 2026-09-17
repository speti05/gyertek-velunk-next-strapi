import type { Metadata } from "next";
import { Luckiest_Guy, Source_Sans_3 } from "next/font/google";
// @ts-ignore-next-line
import "../../sass/main.scss";
// @ts-ignore-next-line
import "../globals.css";
// @ts-ignore-next-line
import "@fortawesome/fontawesome-svg-core/styles.css";

import { cookies } from "next/headers";
import { getGlobalSettings } from "@/data/loaders";
import { getSiteURL } from "@/utils/get-site-url";
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from "@/i18n/config";
import { getTexts } from "@/i18n/texts";
import { LocaleProvider } from "@/context/locale-context";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToHash } from "@/components/ScrollToHash";
import { MuiThemeProvider } from "@/components/providers/theme-provider/theme-provider";
import { AuthProvider } from "@/context/auth-context";
import { CookieConsentProvider } from "@/context/cookie-consent-context";
import { CookieConsentInit } from "@/components/CookieConsentInit";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { RecaptchaProvider } from "@/components/recaptcha-provider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const luckiestGuy = Luckiest_Guy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-luckiest-guy",
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin"],
});

/** Pre-renders both language trees instead of resolving the locale per request. */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const texts = getTexts(isLocale(locale) ? locale : DEFAULT_LOCALE);

  return {
    metadataBase: new URL(getSiteURL()),
    title: texts.SITE_TITLE,
    description: texts.SITE_DESCRIPTION,
  };
}

async function loader() {
  try {
    const res = await getGlobalSettings();
    const { data } = (res as any) ?? {};
    return {
      header: data?.header ?? null,
      footer: data?.footer ?? null,
      // Defaults to hidden: the switcher is opt-in, so an unset field - a record saved
      // before it existed, or a locale that was never meant to be offered - stays off.
      showLanguageSwitcher: data?.showLanguageSwitcher ?? false,
    };
  } catch (error) {
    console.error("Failed to fetch global settings:", error);
    return { header: null, footer: null, showLanguageSwitcher: false };
  }
}

function parseInitialConsent(ccCookieValue: string | undefined) {
  if (!ccCookieValue) {
    return {
      initialHasResponded: false,
      initialRecaptchaConsented: false,
      initialAnalyticsConsented: false,
    };
  }
  try {
    const parsed = JSON.parse(ccCookieValue);
    if (Array.isArray(parsed.categories)) {
      return {
        initialHasResponded: true,
        initialRecaptchaConsented: parsed.categories.includes("recaptcha"),
        initialAnalyticsConsented: parsed.categories.includes("analytics"),
      };
    }
  } catch {
    console.error("Failed to parse cookie consent cookie:", ccCookieValue);
  }
  return {
    initialHasResponded: false,
    initialRecaptchaConsented: false,
    initialAnalyticsConsented: false,
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: rawLocale } = await params;
  // The middleware only ever rewrites to a known locale, but the segment is still a
  // plain string here - fall back rather than render a page with a bogus lang attribute.
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const { header, footer, showLanguageSwitcher } = await loader();
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("jwt")?.value;
  const userEmail = cookieStore.get("user_email")?.value;
  const { initialHasResponded, initialRecaptchaConsented, initialAnalyticsConsented } =
    parseInitialConsent(cookieStore.get("cc_cookie")?.value);

  // Test error handling in RootLayout
  //throw new Error("Test error in RootLayout");

  return (
    <html lang={locale}>
      <body
        suppressHydrationWarning
        className={`${luckiestGuy.variable} ${sourceSans3.variable} min-h-screen flex flex-col`}
      >
        <LocaleProvider locale={locale}>
          <MuiThemeProvider>
          <CookieConsentProvider
            initialHasResponded={initialHasResponded}
            initialRecaptchaConsented={initialRecaptchaConsented}
            initialAnalyticsConsented={initialAnalyticsConsented}
          >
            <AuthProvider isLoggedIn={isLoggedIn} userEmail={userEmail}>
              <RecaptchaProvider>
                <ScrollToHash />
                <Header data={header} socialLinks={footer} showLanguageSwitcher={showLanguageSwitcher} />
                {children}
                <Footer data={footer} />
                <CookieConsentInit />
                <CookieConsentBanner />
                <GoogleAnalytics />
              </RecaptchaProvider>
            </AuthProvider>
          </CookieConsentProvider>
          </MuiThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
