import type { Metadata } from "next";
import { Luckiest_Guy, Source_Sans_3 } from "next/font/google";
import "../sass/main.scss";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { cookies } from "next/headers";
import { getGlobalSettings } from "@/data/loaders";
import { SITE_TITLE, SITE_DESCRIPTION } from "@/utils/texts";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
};

async function loader() {
  try {
    const res = await getGlobalSettings();
    const { data } = (res as any) ?? {};
    return { header: data?.header ?? null, footer: data?.footer ?? null };
  } catch (error) {
    console.error("Failed to fetch global settings:", error);
    return { header: null, footer: null };
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { header, footer } = await loader();
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("jwt")?.value;
  const userEmail = cookieStore.get("user_email")?.value;
  const { initialHasResponded, initialRecaptchaConsented, initialAnalyticsConsented } =
    parseInitialConsent(cookieStore.get("cc_cookie")?.value);

  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${luckiestGuy.variable} ${sourceSans3.variable} min-h-screen flex flex-col`}
      >
        <MuiThemeProvider>
          <CookieConsentProvider
            initialHasResponded={initialHasResponded}
            initialRecaptchaConsented={initialRecaptchaConsented}
            initialAnalyticsConsented={initialAnalyticsConsented}
          >
            <AuthProvider isLoggedIn={isLoggedIn} userEmail={userEmail}>
              <RecaptchaProvider>
                <Header data={header} />
                {children}
                <Footer data={footer} />
                <CookieConsentInit />
                <CookieConsentBanner />
                <GoogleAnalytics />
              </RecaptchaProvider>
            </AuthProvider>
          </CookieConsentProvider>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
